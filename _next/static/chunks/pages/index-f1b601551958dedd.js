(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8312:function(s,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(85)}])},85:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:function(){return Home}});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(5893),react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(7294),next_head__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(9008),next_head__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_2__),zod__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__(1604),classnames__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(4184),classnames__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__),_utils_localStorage__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(6348),serialize_error__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(1141),use_async_effect__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(3280),use_async_effect__WEBPACK_IMPORTED_MODULE_6___default=__webpack_require__.n(use_async_effect__WEBPACK_IMPORTED_MODULE_6__),next_dynamic__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(5152),next_dynamic__WEBPACK_IMPORTED_MODULE_7___default=__webpack_require__.n(next_dynamic__WEBPACK_IMPORTED_MODULE_7__);let Markdown=next_dynamic__WEBPACK_IMPORTED_MODULE_7___default()(()=>Promise.all([__webpack_require__.e(687),__webpack_require__.e(178)]).then(__webpack_require__.bind(__webpack_require__,2178)),{loadableGenerated:{webpack:()=>[2178]},ssr:!1}),stringToJSON=zod__WEBPACK_IMPORTED_MODULE_8__.z.string().transform((s,t)=>{try{return JSON.parse(s)}catch(s){return t.addIssue({code:"custom",message:"Not parsable as JSON"}),zod__WEBPACK_IMPORTED_MODULE_8__.z.NEVER}}),ChatGPTPrecondition=zod__WEBPACK_IMPORTED_MODULE_8__.z.object({model:zod__WEBPACK_IMPORTED_MODULE_8__.z.string(),temperature:zod__WEBPACK_IMPORTED_MODULE_8__.z.number(),messages:zod__WEBPACK_IMPORTED_MODULE_8__.z.array(zod__WEBPACK_IMPORTED_MODULE_8__.z.object({role:zod__WEBPACK_IMPORTED_MODULE_8__.z.enum(["system","user","assistant"]),content:zod__WEBPACK_IMPORTED_MODULE_8__.z.string()}))}),SerializedChatGPTPrecondition=stringToJSON.transform((s,t)=>{let n=ChatGPTPrecondition.safeParse(s);return n.success?n.data:(n.error.issues.forEach(s=>t.addIssue(s)),zod__WEBPACK_IMPORTED_MODULE_8__.z.NEVER)}),initialPrecondition={model:"gpt-3.5-turbo",temperature:.7,messages:[{role:"system",content:"You are an AI chatbot tasked with answering user questions. You have access to a javascript interpreter to help you do so precisely, this allows you to answer questions you wouldn't previously have been able to such as information related to the current time (via a javascript Date).\nDo not attempt to provide the answer directly, first produce a single javascript function 'main' which when called, returns information to help with the answer. Then you can use the result to answer the user. Your answers are rendered with Markdown.\nMessages are prefixed with a single letter for each stage of the communication.\nQ: User query\nF: javascript function\nR: execution result of I\nE: execution error\nA: answer to user query based on R."},{role:"user",content:"Q: What is the 5th even number?"},{role:"assistant",content:"F:\n```\nfunction main() {\n  let current_number = 0\n  let even_number = 0\n  while (even_number < 5) {\n    if (current_number % 2 == 0) even_number += 1;\n    current_number += 1\n  }\n  return current_number - 1\n}\n```"},{role:"user",content:"R: 8"},{role:"assistant",content:"A: The 5th even number is **8**."}]},examples=["What's my IP Address?","How many divs are on this page?","How many years until 32-bit Unix Timestamps become a problem?","How many fibonacci numbers are prime below 1000?"],initialChats={0:{messages:[],n_preconditioning_messages:initialPrecondition.messages.length,model:initialPrecondition.model,temperature:initialPrecondition.temperature,speaker:"welcome"}};function Message(s){let t="system"===s.role?"System":"user"===s.role&&s.content.startsWith("Q:")?"User Query":"assistant"===s.role&&s.content.startsWith("F:")?"Assistant Function":"user"===s.role&&s.content.startsWith("R:")?"Execution Result":"user"===s.role&&s.content.startsWith("E:")?"Execution Error":"assistant"===s.role&&s.content.startsWith("A:")?"Assistant Answer":null,n="System"===t?s.content:"Assistant Function"===t?s.content.slice(3).replaceAll(RegExp("```(\\n.*?\\n```)(\\n|$)","gms"),"```js$1$2"):"Execution Result"===t||"Execution Error"===s.role?"```\n"+s.content.slice(3)+"\n```":s.content.slice(3);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"collapse collapse-plus bg-base-100",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input",{type:"checkbox",defaultChecked:"User Query"===t||"Assistant Answer"===t}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"collapse-title text-xl font-medium",children:t}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"collapse-content",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Markdown,{children:n})})]})}function Home(){let ref=react__WEBPACK_IMPORTED_MODULE_1__.useRef({}),[openapiKey,setOpenapiKey]=(0,_utils_localStorage__WEBPACK_IMPORTED_MODULE_4__.Z)("OPENAPI_KEY",""),[precondition,setPrecondition]=react__WEBPACK_IMPORTED_MODULE_1__.useState(JSON.stringify(initialPrecondition)),[message,setMessage]=react__WEBPACK_IMPORTED_MODULE_1__.useState(""),[chats,setChats]=react__WEBPACK_IMPORTED_MODULE_1__.useState(initialChats),[currentChat,setCurrentChat]=react__WEBPACK_IMPORTED_MODULE_1__.useState("0"),preconditionParsed=react__WEBPACK_IMPORTED_MODULE_1__.useMemo(()=>SerializedChatGPTPrecondition.safeParse(precondition),[precondition]),newChat=react__WEBPACK_IMPORTED_MODULE_1__.useCallback(()=>{let s=(Object.keys(chats).reduce((s,t)=>Math.max(s,+t),0)+1).toString();setChats(t=>({...t,[s]:{speaker:"welcome",model:initialPrecondition.model,temperature:initialPrecondition.temperature,n_preconditioning_messages:0,messages:[]}})),setCurrentChat(s)},[chats]);return use_async_effect__WEBPACK_IMPORTED_MODULE_6___default()(async isMounted=>{for(let chatId in chats){let{speaker,n_preconditioning_messages:_,...body}=chats[chatId];if("assistant-program"===speaker&&!(chatId in ref.current)){if(!isMounted())return;Object.assign(ref.current,{[chatId]:!0});let req1=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json",Authorization:"Bearer ".concat(openapiKey)},body:JSON.stringify({model:body.model,temperature:body.temperature,messages:body.messages})}),res1=await req1.json(),message1=res1.choices[0].message;if(message1.content.startsWith("F:")){let result;setChats(s=>{let{[currentChat]:t,...n}=s;return{...n,[currentChat]:{speaker:"js-engine",model:t.model,temperature:t.temperature,n_preconditioning_messages:t.n_preconditioning_messages,messages:[...t.messages,{role:message1.role,content:message1.content}]}}});let code_expr=RegExp("```(.+?)```","gms"),code_match=code_expr.exec(message1.content);try{let code=code_match[1],ctx={};eval("".concat(code,"\nObject.assign(ctx, { result: main() })")),ctx.result instanceof Promise&&(ctx.result=await ctx.result),"string"!=typeof ctx.result&&(ctx.result=JSON.stringify(ctx.result)),result="R: ".concat(ctx.result)}catch(e){result="E: ".concat((0,serialize_error__WEBPACK_IMPORTED_MODULE_5__.Xy)(e))}console.log({result}),setChats(s=>{let{[currentChat]:t,...n}=s;return{...n,[currentChat]:{speaker:"assistant",model:t.model,temperature:t.temperature,n_preconditioning_messages:t.n_preconditioning_messages,messages:[...t.messages,{role:"user",content:result}]}}});let req2=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json",Authorization:"Bearer ".concat(openapiKey)},body:JSON.stringify({...body,messages:[...body.messages,message1,{role:"user",content:result}]})}),res2=await req2.json(),message2=res2.choices[0].message;setChats(s=>{let{[currentChat]:t,...n}=s;return delete ref.current[chatId],{...n,[currentChat]:{speaker:"user",model:t.model,temperature:t.temperature,n_preconditioning_messages:t.n_preconditioning_messages,messages:[...t.messages,{role:message2.role,content:message2.content}]}}})}else setChats(s=>{let{[currentChat]:t,...n}=s;return{...n,[currentChat]:{speaker:"user",model:t.model,temperature:t.temperature,n_preconditioning_messages:t.n_preconditioning_messages,messages:[...t.messages,{role:message1.role,content:message1.content.startsWith("A:")?message1.content:"A: ".concat(message1.content)}]}}});if(!isMounted())return}}},[ref,openapiKey,chats]),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(next_head__WEBPACK_IMPORTED_MODULE_2___default(),{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("title",{children:"JS GPT"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("meta",{name:"description",content:"A alternative way over interacting with ChatGPT"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"drawer drawer-mobile",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input",{id:"drawer-1",type:"checkbox",className:"drawer-toggle"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"drawer-content flex flex-col",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"w-full navbar bg-base-300 lg:hidden",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"flex-none",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label",{htmlFor:"drawer-1",className:"btn btn-square btn-ghost",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",className:"inline-block w-5 h-5 stroke-current",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M4 6h16M4 12h16M4 18h16"})})})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"flex-1"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"flex-none",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{className:"btn btn-square btn-ghost text-4xl",onClick:s=>{newChat()},children:"+"})})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("main",{className:"container mx-auto flex-grow flex flex-col lg:max-h-screen",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"flex-grow overflow-auto flex flex-col",children:"welcome"===chats[currentChat].speaker?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"flex-grow flex flex-col justify-center items-center text-center",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"prose py-2",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h1",{className:"font-bold",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span",{className:"text-3xl",children:"JS"}),"\xa0",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span",{className:"text-5xl",children:"GPT"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p",{children:"GPT--but answers are coded in Javascript and executed. This helps GPT overcome limitations like getting information about *today*, from external places via API, and provide more reliable calculations."}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p",{children:["NOTE: This is a client-side application, all communication happens with ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a",{href:"https://platform.openai.com/",children:"OpenAPI"}),", all persistent state is stored in ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a",{href:"https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage",children:"localStorage"}),", all execution happens in ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("b",{children:"your"})," browser."]})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"prose py-2",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2",{className:"text-2xl",children:"Settings"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"form-control w-full max-w-xs self-center",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label",{className:"label",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span",{className:"label-text",children:"OpenAPI Key (stored only on your device)"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input",{type:"password",className:"input input-bordered w-full max-w-xs",value:openapiKey,onChange:s=>{setOpenapiKey(()=>s.target.value)}}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label",{className:"label",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span",{children:"\xa0"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span",{className:classnames__WEBPACK_IMPORTED_MODULE_3___default()("label-text",{"text-green-600":!!openapiKey,"text-red-600":!openapiKey}),children:"required"})]})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"form-control",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label",{className:"label",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span",{className:"label-text",children:"System pre-conditioning (sent before your first message)"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("textarea",{className:"textarea textarea-bordered h-24",value:precondition,onChange:s=>{setPrecondition(s.target.value)}}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label",{className:"label",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span",{children:"\xa0"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span",{className:classnames__WEBPACK_IMPORTED_MODULE_3___default()("label-text",{"text-green-600":preconditionParsed.success,"text-red-600":!preconditionParsed.success}),children:preconditionParsed.success?"valid":preconditionParsed.error.issues.map((s,t)=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span",{children:[s.path.length>0?"".concat(s.path.join(".")," : "):null,s.message]},t))})]})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"prose py-2",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2",{className:"text-2xl",children:"Examples"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"grid grid-cols-2 gap-2 max-w-xl",children:examples.map((s,t)=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"card bg-gray-200 hover:shadow-lg cursor-pointer",onClick:()=>{setMessage(()=>s)},children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"card-body items-center text-center",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p",{children:s})})},t))})]}):(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"flex-grow flex flex-col",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"collapse collapse-plus bg-base-100",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input",{type:"checkbox"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"collapse-title text-xl font-medium",children:"Pre-conditioning"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"collapse-content",children:chats[currentChat].messages.slice(0,chats[currentChat].n_preconditioning_messages).map((s,t)=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Message,{...s},t))})]}),chats[currentChat].messages.slice(chats[currentChat].n_preconditioning_messages).map((s,t)=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Message,{...s},t))]})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"text-center p-2",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form",{onSubmit:s=>{s.preventDefault(),setChats(s=>{let{[currentChat]:t,...n}=s;return{...n,[currentChat]:0===t.messages.length&&preconditionParsed.success?{speaker:"assistant-program",model:preconditionParsed.data.model,temperature:preconditionParsed.data.temperature,n_preconditioning_messages:preconditionParsed.data.messages.length,messages:[...preconditionParsed.data.messages,{role:"user",content:"Q: ".concat(message)}]}:{speaker:"assistant-program",model:t.model,temperature:t.temperature,n_preconditioning_messages:t.n_preconditioning_messages,messages:[...t.messages,{role:"user",content:"Q: ".concat(message)}]}}}),setMessage(()=>"")},className:"flex flex-row",style:{height:"".concat(2*Math.min(10,Math.max(2,message.split(/\n/g).length)),"em")},children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("textarea",{className:"input input-bordered border-r-0 rounded-r-none w-full flex-grow p-2",placeholder:"Send a message...",value:message,onChange:s=>{setMessage(()=>s.target.value)},rows:Math.min(10,Math.max(1,message.split(/\n/g).length)),style:{height:"".concat(2*Math.min(10,Math.max(2,message.split(/\n/g).length)),"em")}}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div",{className:"flex flex-col justify-end border-gray-300 border-l-0 rounded-l-none border-r-2 border-t-2 border-b-2 rounded-r-md",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button",{type:"submit",className:"btn btn-ghost",disabled:!openapiKey||!message,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg",{stroke:"currentColor",fill:"none",strokeWidth:"2",viewBox:"0 0 24 24",strokeLinecap:"round",strokeLinejoin:"round",className:"h-4 w-4 mr-1",height:"1em",width:"1em",xmlns:"http://www.w3.org/2000/svg",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("line",{x1:"22",y1:"2",x2:"11",y2:"13"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("polygon",{points:"22 2 15 22 11 13 2 9 22 2"})]})})})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span",{className:"prose text-sm",children:"Free Research Preview. JS-GPT may produce inaccurate information about people, places, or facts."})]})]})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className:"drawer-side",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label",{htmlFor:"drawer-1",className:"drawer-overlay"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul",{className:"menu p-4 w-80 bg-base-100 text-base-content",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li",{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a",{onClick:()=>{newChat()},children:"+ New chat"})}),Object.keys(chats).map(s=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li",{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("a",{className:classnames__WEBPACK_IMPORTED_MODULE_3___default()({"font-bold":s===currentChat}),onClick:()=>{setCurrentChat(s)},children:["Chat ",s.toString()]})},s)),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li",{className:"flex-grow",children:"\xa0"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li",{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("hr",{})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li",{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a",{onClick:s=>{setCurrentChat(()=>"0"),setChats(()=>initialChats)},children:"Clear conversations"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li",{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a",{href:"https://github.com/u8sand/js-gpt",target:"_blank",children:"GitHub"})})]})]})]})]})}},6348:function(s,t,n){"use strict";n.d(t,{Z:function(){return r}});var a=n(7294);function r(s,t){let[n,r]=a.useState(t);return a.useEffect(()=>{let n=t=>{t.key===s&&r(()=>t.newValue||"")};return r(()=>localStorage.getItem(s)||t),window.addEventListener("storage",n),()=>{window.removeEventListener("storage",n)}},[s,t]),[n,t=>r(a=>{let r=t(a);return r!=n?(localStorage.setItem(s,r),r):a})]}}},function(s){var t=function(t){return s(s.s=t)};s.O(0,[243,774,888,179],function(){return t(8312)}),_N_E=s.O()}]);