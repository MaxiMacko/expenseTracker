import{j as e}from"./jsx-runtime-BjG_zV1W.js";function a({onAddExpense:t}){return e.jsxs("div",{className:"flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm uppercase tracking-[0.24em] text-slate-500",children:"Expense tracker"}),e.jsx("h1",{className:"mt-1 text-3xl font-semibold text-slate-900",children:"Manage spending with clarity"})]}),e.jsx("button",{type:"button",onClick:t,className:"inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500",children:"Add Expense"})]})}a.__docgenInfo={description:"",methods:[],displayName:"Toolbar",props:{onAddExpense:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const b={title:"Components/Toolbar",component:a,parameters:{layout:"padded"},tags:["autodocs"]},s={args:{onAddExpense:()=>alert("Add expense clicked")},render:t=>e.jsxs("div",{className:"bg-gradient-to-r from-sky-50 to-blue-50 p-4",children:[e.jsx(a,{...t}),e.jsx("p",{className:"text-xs text-slate-600 mt-4",children:'Click "Add Expense" button to trigger the action'})]})},r={args:{onAddExpense:()=>alert("Opening expense modal...")},render:t=>e.jsxs("div",{className:"bg-gradient-to-r from-sky-50 to-blue-50 p-4",children:[e.jsx(a,{...t}),e.jsx("p",{className:"text-xs text-slate-600 mt-4",children:"Click button to add a new expense to the tracker"})]})};var o,n,i,d,c;s.parameters={...s.parameters,docs:{...(o=s.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    onAddExpense: () => alert('Add expense clicked')
  },
  render: args => <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4">
      <Toolbar {...args} />
      <p className="text-xs text-slate-600 mt-4">Click "Add Expense" button to trigger the action</p>
    </div>
}`,...(i=(n=s.parameters)==null?void 0:n.docs)==null?void 0:i.source},description:{story:"Toolbar displays the application header with logo/title and action buttons.",...(c=(d=s.parameters)==null?void 0:d.docs)==null?void 0:c.description}}};var l,p,m,x,u;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    onAddExpense: () => alert('Opening expense modal...')
  },
  render: args => <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4">
      <Toolbar {...args} />
      <p className="text-xs text-slate-600 mt-4">Click button to add a new expense to the tracker</p>
    </div>
}`,...(m=(p=r.parameters)==null?void 0:p.docs)==null?void 0:m.source},description:{story:"Shows the toolbar in an interactive state with action feedback.",...(u=(x=r.parameters)==null?void 0:x.docs)==null?void 0:u.description}}};const f=["Default","Interactive"];export{s as Default,r as Interactive,f as __namedExportsOrder,b as default};
