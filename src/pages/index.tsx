import React from 'react'
import Head from 'next/head'
import { z } from 'zod'
import classNames from 'classnames'

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
    { role: 'system', content: `You are an AI chatbot tasked with answering user questions, you have access to a javascript interpreter to help you do so precisely,
  this allows you to answer questions you wouldn't previously have been able to such as information related to the current time (via a javascript Date).
  Do not attempt to provide the answer directly, provide a single javascript function 'main' which when called, returns the answer.
  
  Replies should be in stages.
  1. User: Asks a question.
  2. Assistant: Javascript function 'main' which returns the answer to the question.
  3. User: Executes your function using a javascript interpreter.
  4. Assistant: Using the output from the javascript interpreter, reply to the user with an answer to their question.
` },
    { role: 'user', content: 'What is the 5th even number?' },
    { role: 'assistant', content: `
\`\`\`
function main() {
  let current_number = 0
  let even_number = 0
  while (even_number < 5) {
    if (current_number % 2 == 0) even_number += 1;
    current_number += 1
  }
  return current_number
}
\`\`\`
` },
    { role: 'user', content: '9' },
    { role: 'assistant', content: 'The 5th even number is 9.' },
  ],
}

export default function Home() {
  const ref = React.useRef<Record<string, boolean>>({})
  const [openapiKey, setOpenapiKey] = React.useState('')
  const [precondition, setPrecondition] = React.useState(JSON.stringify(initialPrecondition))
  const [message, setMessage] = React.useState('')
  const [chats, setChats] = React.useState<Record<string, {
    speaker: 'welcome' | 'user' | 'assistant-program' | 'js-engine' | 'assistant',
    model: string,
    temperature: number,
    messages: { internalRole?: string, role: string, content : string }[]
  }>>({ ['0']: { messages: [], model: initialPrecondition.model, temperature: initialPrecondition.temperature, speaker: 'welcome' } })
  const [currentChat, setCurrentChat] = React.useState('0')
  const preconditionParsed = React.useMemo(() => SerializedChatGPTPrecondition.safeParse(precondition), [precondition])
  React.useEffect(() => {
    for (const chatId in chats) {
      const { speaker, ...body } = chats[chatId]
      if (speaker === 'assistant-program') {
        if (!(chatId in ref.current)) {
          Object.assign(ref.current, { [chatId]: true }) 
          fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${openapiKey}`,
            },
            body: JSON.stringify({
              model: body.model,
              temperature: body.temperature,
              messages: body.messages.map(({ role, content }) => ({ role, content })),
            }),
          }).then((res) => res.json()).then(async (res) => {
            const message = res.choices[0].message
            setChats(({ [currentChat]: cc, ...chats }) => ({
              ...chats, [currentChat]: {
                speaker: 'js-engine',
                model: cc.model,
                temperature: cc.temperature,
                messages: [...cc.messages, { internalRole: 'assistant-program', role: message.role, content: message.content }],
              }
            }))
            const code_expr = new RegExp('```(.+?)```', 'gms')
            const code_match = code_expr.exec(message.content)
            let result: string
            try {
              const code = (code_match as RegExpExecArray)[1]
              const ctx: any = {}
              eval(`${code}\nObject.assign(ctx, { result: main() })`)
              result = JSON.stringify(ctx.result instanceof Promise ? await ctx.result : ctx.result)
            } catch (e) {
              result = (e as Error).toString()
            }
            console.log({ result })
            setChats(({ [currentChat]: cc, ...chats }) => ({
              ...chats, [currentChat]: {
                speaker: 'assistant',
                model: cc.model,
                temperature: cc.temperature,
                messages: [...cc.messages, { internalRole: 'js-engine', role: 'user', content: result }],
              }
            }))
            return await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${openapiKey}`,
              },
              body: JSON.stringify({
                ...body,
                messages: [
                  ...body.messages.map(({ role, content }) => ({ role, content })),
                  message,
                  { role: 'user', content: result },
                ],
              }),
            })
          }).then((res) => res.json()).then((res) => {
            const message = res.choices[0].message
            setChats(({ [currentChat]: cc, ...chats }) => {
              delete ref.current[chatId]
              return {
                ...chats, [currentChat]: {
                  speaker: 'user',
                  model: cc.model,
                  temperature: cc.temperature,
                  messages: [...cc.messages, { internalRole: 'assistant', role: message.role, content: message.content }],
                }
              }
            })
          })
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
              <button className="btn btn-square btn-ghost text-4xl">
                +
              </button>
            </div>
          </div>
          <main className="container mx-auto flex-grow flex flex-col">
            {chats[currentChat].speaker === 'welcome' ?
              <div className="hero flex-grow">
                <div className="hero-content text-center">
                  <div className="max-w-md prose">
                    <h1 className="font-bold"><span className="text-3xl">JS</span>&nbsp;<span className="text-5xl">GPT</span></h1>
                    <p className="py-2">GPT--but answers are coded in Javascript and executed. This helps GPT overcome limitations like getting information about *today*, from external places via API, and provide more reliable calculations.</p>
                    <p className="py-2">NOTE: This is a client-side application, all communication happens with <a href="https://platform.openai.com/">OpenAPI</a>, all persistent state is stored in <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage">localStorage</a>, all execution happens in <b>your</b> browser.</p>
                    <div className="py-2 flex flex-col">
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
                  </div>
                </div>
              </div>
            : <div className="flex-grow flex flex-col">
                {chats[currentChat].messages.map((message, i) => <span key={i} className="whitespace-pre-line">{message.role}: {message.content}</span>)}
              </div>}
            <div className='text-center p-2'>
              <form
                onSubmit={evt => {
                  evt.preventDefault()
                  setChats(({ [currentChat]: cc, ...chats }) => ({
                    ...chats, [currentChat]: cc.messages.length === 0 && preconditionParsed.success ? {
                      speaker: 'assistant-program',
                      model: preconditionParsed.data.model,
                      temperature: preconditionParsed.data.temperature, 
                      messages: [...preconditionParsed.data.messages, { internalRole: 'user', role: 'user', content: message }],
                    } : {
                      speaker: 'assistant-program',
                      model: cc.model,
                      temperature: cc.temperature,
                      messages: [...cc.messages, { internalRole: 'user', role: 'user', content: message }],
                    }
                  }))
                  setMessage('')
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
              <span className="prose text-sm">JS-GPT April 15 Version. Free Research Preview. JS-GPT may produce inaccurate information about people, places, or facts.</span>
            </div>
          </main>
        </div>
        <div className="drawer-side">
          <label htmlFor="drawer-1" className="drawer-overlay"></label> 
          <ul className="menu p-4 w-80 bg-base-100 text-base-content">
            <li><a onClick={() => {
              const newChatKey = (Object.keys(chats).reduce((agg, chatKey) => Math.max(agg, +chatKey), 0)+1).toString()
              setChats((chats) => ({ ...chats, [newChatKey]: { speaker: 'welcome', model: initialPrecondition.model, temperature: initialPrecondition.temperature, messages: [] } }))
              setCurrentChat(newChatKey)
            }}>+ New chat</a></li>
            {Object.keys(chats)
              .map(chatKey =>
                <li key={chatKey}>
                  <a className={classNames({ 'font-bold': chatKey === currentChat })} onClick={() => {setCurrentChat(chatKey)}}>Chat {chatKey.toString()}</a>
                </li>)}
            <li className='flex-grow'>&nbsp;</li>
            <li><hr /></li>
            <li><a>Clear conversations</a></li>
            <li><a>Settings</a></li>
          </ul>
        </div>
      </div>
    </>
  )
}
