import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{r as x}from"./index-B3TfwC44.js";const h=[{id:"table",label:"Expenses"},{id:"charts",label:"Analytics"}];function n({activeTab:t,setActiveTab:i}){return e.jsx("div",{className:"inline-flex overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-1",children:h.map(a=>e.jsx("button",{type:"button",onClick:()=>i(a.id),className:`rounded-3xl px-4 py-2 text-sm font-semibold transition ${t===a.id?"bg-white text-slate-900 shadow-sm":"text-slate-500 hover:text-slate-900"}`,children:a.label},a.id))})}n.__docgenInfo={description:"",methods:[],displayName:"TabSwitcher",props:{activeTab:{required:!0,tsType:{name:"union",raw:"'table' | 'charts'",elements:[{name:"literal",value:"'table'"},{name:"literal",value:"'charts'"}]},description:""},setActiveTab:{required:!0,tsType:{name:"signature",type:"function",raw:"(tab: TabName) => void",signature:{arguments:[{type:{name:"union",raw:"'table' | 'charts'",elements:[{name:"literal",value:"'table'"},{name:"literal",value:"'charts'"}]},name:"tab"}],return:{name:"void"}}},description:""}}};const w={title:"Components/TabSwitcher",component:n,parameters:{layout:"centered"},tags:["autodocs"]},s={args:{activeTab:"table",setActiveTab:()=>{}}},r={args:{activeTab:"charts",setActiveTab:()=>{}}},c={args:{activeTab:"table",setActiveTab:()=>{}},render:()=>{const[t,i]=x.useState("table");return e.jsxs("div",{className:"w-full space-y-4",children:[e.jsx(n,{activeTab:t,setActiveTab:i}),e.jsxs("p",{className:"text-sm text-slate-600",children:["Active tab: ",e.jsx("strong",{children:t})]})]})}};var o,l,b;s.parameters={...s.parameters,docs:{...(o=s.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    activeTab: 'table',
    setActiveTab: () => {}
  }
}`,...(b=(l=s.parameters)==null?void 0:l.docs)==null?void 0:b.source}}};var d,m,v;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    activeTab: 'charts',
    setActiveTab: () => {}
  }
}`,...(v=(m=r.parameters)==null?void 0:m.docs)==null?void 0:v.source}}};var p,u,T;c.parameters={...c.parameters,docs:{...(p=c.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    activeTab: 'table',
    setActiveTab: () => {}
  },
  render: () => {
    const [activeTab, setActiveTab] = useState<TabName>('table');
    return <div className="w-full space-y-4">
        <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
        <p className="text-sm text-slate-600">Active tab: <strong>{activeTab}</strong></p>
      </div>;
  }
}`,...(T=(u=c.parameters)==null?void 0:u.docs)==null?void 0:T.source}}};const f=["TableActive","ChartsActive","Interactive"];export{r as ChartsActive,c as Interactive,s as TableActive,f as __namedExportsOrder,w as default};
