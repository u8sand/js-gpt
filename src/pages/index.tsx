import React from 'react'
import Head from 'next/head'
import { z } from 'zod'
import classNames from 'classnames'
import useLocalStorage from '@/utils/localStorage'
import { serializeError } from 'serialize-error'
import useAsyncEffect from 'use-async-effect'
import dynamic from 'next/dynamic'

const Markdown = dynamic(() => import('@/components/markdown'), { ssr: false })

const stringToJSON = z.string().transform((serialized, ctx) => {
  try {
    return JSON.parse(serialized)
  } catch (e) {
    ctx.addIssue({ code: 'custom', message: 'Not parsable as JSON' })
    return z.NEVER
  }
})
const ChatGPTPrecondition = z.object({
  model: z.string(),
  temperature: z.number(),
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string(),
  })),
})
const SerializedChatGPTPrecondition = stringToJSON.transform((obj, ctx) => {
  const result = ChatGPTPrecondition.safeParse(obj)
  if (result.success) return result.data
  else {
    result.error.issues.forEach(issue => ctx.addIssue(issue))
    return z.NEVER
  }
})

const initialPrecondition = {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  messages: [
    { role: 'system', content:
      "You are an AI chatbot tasked with answering user questions." +
      " You have access to a javascript interpreter to help you do so precisely," +
      " this allows you to answer questions you wouldn't previously have been able" +
      " to such as information related to the current time (via a javascript Date)." +
      "\nDo not attempt to provide the answer directly, first produce a single javascript function" +
      " 'main' which when called, returns information to help with the answer. Then you can" +
      " use the result to answer the user. Your answers are rendered with Markdown." +
      "\nMessages are prefixed with a single letter for each stage of the communication." +
      "\nQ: User query\nF: javascript function\nR: execution result of I\nE: execution error\nA: answer to user query based on R." },
    { role: 'user', content:
      "Q: What is the 5th even number?" },
    { role: 'assistant', content:
      "F:" +
      "\n```" +
      "\nfunction main() {" +
      "\n  let current_number = 0" +
      "\n  let even_number = 0" +
      "\n  while (even_number < 5) {" +
      "\n    if (current_number % 2 == 0) even_number += 1;" +
      "\n    current_number += 1" +
      "\n  }" +
      "\n  return current_number - 1" +
      "\n}" +
      "\n```" },
    { role: 'user', content:
      "R: 8" },
    { role: 'assistant', content:
      "A: The 5th even number is **8**." },
  ],
}

const examples = [
  "How many years until 32-bit Unix Timestamps become a problem?",
  "How many fibonacci numbers are prime below 1000?",
]

const initialChats = { ['0']: {
  messages: [],
  n_preconditioning_messages: initialPrecondition.messages.length,
  model: initialPrecondition.model,
  temperature: initialPrecondition.temperature,
  speaker: 'welcome'
} } as Record<string, {
  speaker: 'welcome' | 'user' | 'assistant-program' | 'js-engine' | 'assistant',
  n_preconditioning_messages: number,
  model: string,
  temperature: number,
  messages: { role: string, content : string }[],
}>


function Message(props: { role: string, content: string }) {
  const role = props.role === 'system' ? 'System'
    : props.role === 'user' && props.content.startsWith('Q:') ? 'User Query'
    : props.role === 'assistant' && props.content.startsWith('F:') ? 'Assistant Function'
    : props.role === 'user' && props.content.startsWith('R:') ? 'Execution Result'
    : props.role === 'user' && props.content.startsWith('E:') ? 'Execution Error'
    : props.role === 'assistant' && props.content.startsWith('A:') ? 'Assistant Answer'
    : null
  const content = role === 'System' ? props.content
    : role === 'Assistant Function' ? props.content.slice(3).replaceAll(/```(\n.*?\n```)(\n|$)/gms, '```js$1$2')
    : role === 'Execution Result' || props.role === 'Execution Error' ? '```' + props.content.slice(3) + '```'
    : props.content.slice(3)
  return (
    <div className="collapse collapse-plus bg-base-100">
      <input type="checkbox" defaultChecked={role === 'User Query' || role === 'Assistant Answer'} />
      <div className="collapse-title text-xl font-medium">{role}</div>
      <div className="collapse-content"><Markdown>{content}</Markdown></div>
    </div>
  )
}

export default function Home() {
  const ref = React.useRef<Record<string, boolean>>({})
  const [openapiKey, setOpenapiKey] = useLocalStorage('OPENAPI_KEY', '')
  const [precondition, setPrecondition] = React.useState(JSON.stringify(initialPrecondition))
  const [message, setMessage] = React.useState('')
  const [chats, setChats] = React.useState(initialChats)
  const [currentChat, setCurrentChat] = React.useState('0')
  const preconditionParsed = React.useMemo(() => SerializedChatGPTPrecondition.safeParse(precondition), [precondition])
  const newChat = React.useCallback(() => {
    const newChatKey = (Object.keys(chats).reduce((agg, chatKey) => Math.max(agg, +chatKey), 0)+1).toString()
    setChats((chats) => ({ ...chats, [newChatKey]: {
      speaker: 'welcome',
      model: initialPrecondition.model,
      temperature: initialPrecondition.temperature,
      n_preconditioning_messages: 0,
      messages: [],
    } }))
    setCurrentChat(newChatKey)
  }, [chats])
  useAsyncEffect(async (isMounted) => {
    for (const chatId in chats) {
      const { speaker, n_preconditioning_messages: _, ...body } = chats[chatId]
      if (speaker === 'assistant-program') {
        if (!(chatId in ref.current)) {
          if (!isMounted()) return
          Object.assign(ref.current, { [chatId]: true })
          const req1 = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${openapiKey}`,
            },
            body: JSON.stringify({
              model: body.model,
              temperature: body.temperature,
              messages: body.messages,
            }),
          })
          const res1 = await req1.json()
          const message1 = res1.choices[0].message
          if (!message1.content.startsWith('F:')) {
            // assistent doesn't choose to call the function then we won't execute it as such
            setChats(({ [currentChat]: cc, ...chats }) => ({
              ...chats, [currentChat]: {
                speaker: 'user',
                model: cc.model,
                temperature: cc.temperature,
                n_preconditioning_messages: cc.n_preconditioning_messages,
                messages: [...cc.messages, {
                  role: message1.role,
                  // assistant omits prefix altogether, we consider it an answer
                  content: message1.content.startsWith('A:') ? message1.content : `A: ${message1.content}`
                }],
              }
            }))
          } else {
            setChats(({ [currentChat]: cc, ...chats }) => ({
              ...chats, [currentChat]: {
                speaker: 'js-engine',
                model: cc.model,
                temperature: cc.temperature,
                n_preconditioning_messages: cc.n_preconditioning_messages,
                messages: [...cc.messages, { role: message1.role, content: message1.content }],
              }
            }))
            const code_expr = new RegExp('```(.+?)```', 'gms')
            const code_match = code_expr.exec(message1.content)
            let result: string
            try {
              const code = (code_match as RegExpExecArray)[1]
              const ctx: any = {}
              eval(`${code}\nObject.assign(ctx, { result: main() })`)
              if (ctx.result instanceof Promise) ctx.result = await ctx.result
              if (typeof ctx.result !== 'string') ctx.result = JSON.stringify(ctx.result)
              result = `R: ${ctx.result}`
            } catch (e) {
              result = `E: ${serializeError(e)}`
            }
            console.log({ result })
            setChats(({ [currentChat]: cc, ...chats }) => ({
              ...chats, [currentChat]: {
                speaker: 'assistant',
                model: cc.model,
                temperature: cc.temperature,
                n_preconditioning_messages: cc.n_preconditioning_messages,
                messages: [...cc.messages, { role: 'user', content: result }],
              }
            }))
            const req2 = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${openapiKey}`,
              },
              body: JSON.stringify({
                ...body,
                messages: [
                  ...body.messages,
                  message1,
                  { role: 'user', content: result },
                ],
              }),
            })
            const res2 = await req2.json()
            const message2 = res2.choices[0].message
            setChats(({ [currentChat]: cc, ...chats }) => {
              delete ref.current[chatId]
              return {
                ...chats, [currentChat]: {
                  speaker: 'user',
                  model: cc.model,
                  temperature: cc.temperature,
                  n_preconditioning_messages: cc.n_preconditioning_messages,
                  messages: [...cc.messages, { role: message2.role, content: message2.content }],
                }
              }
            })
          }
          if (!isMounted()) return
        }
      }
    }
  }, [ref, openapiKey, chats])
  return (
    <>
      <Head>
        <title>JS GPT</title>
        <meta name="description" content="A alternative way over interacting with ChatGPT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="drawer drawer-mobile">
        <input id="drawer-1" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="w-full navbar bg-base-300 lg:hidden">
            <div className="flex-none">
              <label htmlFor="drawer-1" className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </label>
            </div>
            <div className="flex-1"></div>
            <div className="flex-none">
              <button className="btn btn-square btn-ghost text-4xl" onClick={evt => {newChat()}}>
                +
              </button>
            </div>
          </div>
          <main className="container mx-auto flex-grow flex flex-col lg:max-h-screen">
            <div className="flex-grow overflow-auto flex flex-col">
              {chats[currentChat].speaker === 'welcome' ?
                <div className="flex-grow flex flex-col justify-center items-center text-center">
                  <div className="prose py-2">
                    <h1 className="font-bold"><span className="text-3xl">JS</span>&nbsp;<span className="text-5xl">GPT</span></h1>
                    <p>GPT--but answers are coded in Javascript and executed. This helps GPT overcome limitations like getting information about *today*, from external places via API, and provide more reliable calculations.</p>
                    <p>NOTE: This is a client-side application, all communication happens with <a href="https://platform.openai.com/">OpenAPI</a>, all persistent state is stored in <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage">localStorage</a>, all execution happens in <b>your</b> browser.</p>
                  </div>
                  <div className="prose py-2">
                    <h2 className="text-2xl">Settings</h2>
                  </div>
                  <div className="form-control w-full max-w-xs self-center">
                    <label className="label">
                      <span className="label-text">OpenAPI Key (stored only on your device)</span>
                    </label>
                    <input type="password" className="input input-bordered w-full max-w-xs" value={openapiKey} onChange={evt => {setOpenapiKey(() => evt.target.value)}} />
                    <label className="label">
                      <span>&nbsp;</span>
                      <span className={classNames("label-text", {"text-green-600": !!openapiKey, "text-red-600": !openapiKey})}>required</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">System pre-conditioning (sent before your first message)</span>
                    </label>
                    <textarea className="textarea textarea-bordered h-24" value={precondition} onChange={evt => {setPrecondition(evt.target.value)}}></textarea>
                    <label className="label">
                      <span>&nbsp;</span>
                      <span className={classNames("label-text", {"text-green-600": preconditionParsed.success, "text-red-600": !preconditionParsed.success})}>
                        {preconditionParsed.success ? 'valid' : preconditionParsed.error.issues.map((issue, i) => <span key={i}>{issue.path.length > 0 ? `${issue.path.join('.')} : ` : null}{issue.message}</span>)}
                      </span>
                    </label>
                  </div>
                  <div className="prose py-2">
                    <h2 className="text-2xl">Examples</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-w-xl">
                    {examples.map((example, i) => (
                      <div
                        key={i}
                        className="card bg-gray-200 hover:shadow-lg cursor-pointer"
                        onClick={() => {setMessage(() => example)}}
                      >
                        <div className="card-body items-center text-center">
                          <p>{example}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              : <div className="flex-grow flex flex-col">
                  <div className="collapse collapse-plus bg-base-100">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">Pre-conditioning</div>
                    <div className="collapse-content">
                      {chats[currentChat].messages
                        .slice(0, chats[currentChat].n_preconditioning_messages)
                        .map((message, i) => <Message key={i} {...message} />)}
                    </div>
                  </div>
                  {chats[currentChat].messages
                    .slice(chats[currentChat].n_preconditioning_messages)
                    .map((message, i) => <Message key={i} {...message} />)}
                </div>}
            </div>
            <div className='text-center p-2'>
              <form
                onSubmit={evt => {
                  evt.preventDefault()
                  setChats(({ [currentChat]: cc, ...chats }) => ({
                    ...chats, [currentChat]: cc.messages.length === 0 && preconditionParsed.success ? {
                      speaker: 'assistant-program',
                      model: preconditionParsed.data.model,
                      temperature: preconditionParsed.data.temperature, 
                      n_preconditioning_messages: preconditionParsed.data.messages.length,
                      messages: [...preconditionParsed.data.messages, { role: 'user', content: `Q: ${message}` }],
                    } : {
                      speaker: 'assistant-program',
                      model: cc.model,
                      temperature: cc.temperature,
                      n_preconditioning_messages: cc.n_preconditioning_messages,
                      messages: [...cc.messages, { role: 'user', content: `Q: ${message}` }],
                    }
                  }))
                  setMessage(() => '')
                }}
                className="flex flex-row"
                style={{ height: `${Math.min(10, Math.max(2, message.split(/\n/g).length)) * 2}em` }}
              >
                <textarea
                  className="input input-bordered border-r-0 rounded-r-none w-full flex-grow p-2"
                  placeholder="Send a message..."
                  value={message}
                  onChange={evt => {setMessage(() => evt.target.value)}}
                  rows={Math.min(10, Math.max(1, message.split(/\n/g).length))}
                  style={{ height: `${Math.min(10, Math.max(2, message.split(/\n/g).length)) * 2}em` }}
                />
                <div className="flex flex-col justify-end border-gray-300 border-l-0 rounded-l-none border-r-2 border-t-2 border-b-2 rounded-r-md">
                  <button type="submit" className="btn btn-ghost" disabled={!openapiKey || !message}><svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
                </div>
              </form>
              <span className="prose text-sm">Free Research Preview. JS-GPT may produce inaccurate information about people, places, or facts.</span>
            </div>
          </main>
        </div>
        <div className="drawer-side">
          <label htmlFor="drawer-1" className="drawer-overlay"></label> 
          <ul className="menu p-4 w-80 bg-base-100 text-base-content">
            <li><a onClick={() => {newChat()}}>+ New chat</a></li>
            {Object.keys(chats)
              .map(chatKey =>
                <li key={chatKey}>
                  <a className={classNames({ 'font-bold': chatKey === currentChat })} onClick={() => {setCurrentChat(chatKey)}}>Chat {chatKey.toString()}</a>
                </li>)}
            <li className='flex-grow'>&nbsp;</li>
            <li><hr /></li>
            <li><a onClick={evt => {
              setCurrentChat(() => '0')
              setChats(() => initialChats)
            }}>Clear conversations</a></li>
            <li><a href="https://github.com/u8sand/js-gpt" target='_blank'>GitHub</a></li>
          </ul>
        </div>
      </div>
    </>
  )
}
