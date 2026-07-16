import{r as e}from"./rolldown-runtime-QTnfLwEv.js";import{n as t,t as n}from"./jsx-runtime-CIxEorsV.js";import{t as r}from"./AuthContext-DSLeeOZZ.js";import{n as i}from"./dist-PApitMpb.js";import{t as a}from"./api-C49hO6Qh.js";import{t as o}from"./circle-check-big-CRq2UYsB.js";import{t as s}from"./circle-x-DD-XisD3.js";import{t as c}from"./printer-ChUTwBVn.js";import{Zt as l,dn as u,en as d,xn as f}from"./index-0ZHLGXIk.js";var p=e(t(),1),m=n(),h=({status:e})=>{let t=(()=>{switch(e?.toLowerCase()){case`delivered`:return{classes:`bg-emerald-50 text-emerald-600 border-emerald-200`,icon:(0,m.jsx)(o,{className:`w-4 h-4 mr-1.5`})};case`shipped`:return{classes:`bg-blue-50 text-blue-600 border-blue-200`,icon:(0,m.jsx)(d,{className:`w-4 h-4 mr-1.5 animate-pulse`})};case`processing`:return{classes:`bg-amber-50 text-amber-600 border-amber-200`,icon:(0,m.jsx)(f,{className:`w-4 h-4 mr-1.5 animate-spin-slow`})};default:return{classes:`bg-gray-50 text-gray-600 border-gray-200`,icon:(0,m.jsx)(u,{className:`w-4 h-4 mr-1.5`})}}})();return(0,m.jsxs)(`span`,{className:`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold border ${t.classes}`,children:[t.icon,e]})},g=()=>{let{user:e}=(0,p.useContext)(r),t=()=>{let e=g.items?.map(e=>`
    <tr>
      <td>${e.product_name}</td>
      <td>${e.variant_color||`-`}</td>
      <td>${e.variant_size||`-`}</td>
      <td>${e.quantity}</td>
      <td>₹${e.price}</td>
      <td>₹${e.price*e.quantity}</td>
    </tr>
  `).join(``),t=`
<html>
<head>
<title>Order Invoice</title>

<style>
body{
  font-family: Arial, sans-serif;
  padding:40px;
  background:#f8f8f8;
}

.card{
  max-width:800px;
  margin:auto;
  background:white;
  border-radius:10px;
  padding:30px;
  box-shadow:0 5px 20px rgba(0,0,0,0.1);
}

h2{
  margin-bottom:20px;
}

.section{
  margin-top:25px;
}

.row{
  display:flex;
  justify-content:space-between;
  border-bottom:1px solid #eee;
  padding:8px 0;
  font-size:14px;
}

table{
  width:100%;
  border-collapse:collapse;
  margin-top:10px;
}

th,td{
  border:1px solid #ddd;
  padding:8px;
  text-align:left;
  font-size:14px;
}

th{
  background:#f5f5f5;
}

.total{
  font-weight:bold;
  font-size:16px;
  margin-top:15px;
}
</style>
</head>

<body>

<div class="card">

<h2>Order Details</h2>

<div class="row">
<span>Order ID</span>
<span>${g.order_id||g.id}</span>
</div>

<div class="row">
<span>Date</span>
<span>${new Date(g.created_at).toLocaleDateString()}</span>
</div>

<div class="row">
<span>Status</span>
<span>${g.status}</span>
</div>

<div class="row total">
<span>Total Amount</span>
<span>₹${g.total_amount}</span>
</div>

<div class="section">
<h3>Shipping Address</h3>

<p><b>${S?.customer_name||``}</b></p>
<p>${S?.street_address||``}</p>
<p>${S?.city||``}, ${S?.district||``}</p>
<p>${S?.state||``} - ${S?.zip_code||``}</p>
<p>${S?.country||``}</p>
<p>Phone: ${S?.customer_phone||``}</p>
<p>Email: ${S?.customer_email||``}</p>

</div>

<div class="section">

<h3>Products</h3>

<table>

<thead>
<tr>
<th>Product</th>
<th>Color</th>
<th>Size</th>
<th>Qty</th>
<th>Price</th>
<th>Subtotal</th>
</tr>
</thead>

<tbody>

${e}

</tbody>

</table>

</div>

</div>

</body>
</html>
`,n=window.open(``,``,`width=800,height=600`);n.document.write(t),n.document.close(),n.focus(),n.print()},[n,f]=(0,p.useState)([]),[g,_]=(0,p.useState)(null),[v,y]=(0,p.useState)(!1),[b,x]=(0,p.useState)(!1),[S,C]=(0,p.useState)(null),[w,T]=(0,p.useState)(``),E=()=>{if(!w.trim()){i.error(`Please enter an Order ID`);return}let e=n.find(e=>e.id.toString()===w.trim()||e.order_id===w.trim());e?D(e):i.error(`Order not found or invalid Order ID`)};(0,p.useEffect)(()=>{e?.user_id&&(async()=>{try{let t=((await a.get(`/orders`)).data||[]).filter(t=>t.user_id===e?.user_id);f(t)}catch(e){console.error(`Failed to load orders`,e)}})()},[e]);let D=async e=>{x(!0);try{let t=await a.get(`/orders/${e.id}`);_(t.data),y(!0)}catch(e){console.error(`Failed to load order details`,e)}finally{x(!1)}};return(0,m.jsxs)(`div`,{className:`min-h-screen bg-[#FDFBF7] py-10`,children:[(0,m.jsx)(l,{children:(0,m.jsxs)(`div`,{className:` space-y-8`,children:[(0,m.jsxs)(`div`,{className:`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`,children:[(0,m.jsx)(`h1`,{className:`text-3xl font-bold text-gray-900`,children:`My Orders`}),(0,m.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,m.jsx)(`input`,{type:`text`,placeholder:`Enter Order ID`,className:`w-full md:w-56 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary`,value:w,onChange:e=>T(e.target.value)}),(0,m.jsx)(`button`,{onClick:E,className:`bg-primary text-white px-5 py-2 rounded-xl font-semibold hover:opacity-90 transition whitespace-nowrap cursor-pointer`,children:`Track Order`})]})]}),n.length===0?(0,m.jsx)(`p`,{className:`text-gray-500`,children:`No orders found`}):(0,m.jsx)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 gap-8 items-start`,children:n.map(e=>(0,m.jsxs)(`div`,{onClick:()=>D(e),className:`bg-white rounded-3xl border border-primary/10 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden group`,children:[(0,m.jsx)(`div`,{className:`h-2 w-full bg-gradient-to-r from-primary-light via-primary-light to-secondary`}),(0,m.jsx)(`div`,{className:`bg-gradient-to-br from-primary-light/10 via-white to-secondary/10 pt-6 px-6 pb-4`,children:(0,m.jsxs)(`div`,{className:`grid md:grid-cols-2 gap-x-12 gap-y-4 text-sm`,children:[(0,m.jsxs)(`div`,{className:`flex justify-between border-b border-primary/10 pb-2`,children:[(0,m.jsx)(`span`,{className:`text-gray-500`,children:`Order ID`}),(0,m.jsx)(`span`,{className:`font-semibold`,children:e.order_id||e.id})]}),(0,m.jsxs)(`div`,{className:`flex justify-between border-b border-primary/10 pb-2`,children:[(0,m.jsx)(`span`,{className:`text-gray-500`,children:`Date`}),(0,m.jsx)(`span`,{className:`font-semibold`,children:new Date(e.created_at).toLocaleDateString()})]}),(0,m.jsxs)(`div`,{className:`flex justify-between border-b border-primary/10 pb-2`,children:[(0,m.jsx)(`span`,{className:`text-gray-500`,children:`Status`}),(0,m.jsx)(h,{status:e.status})]}),(0,m.jsxs)(`div`,{className:`flex justify-between pt-2 text-base font-bold bg-primary/5 px-3 py-2 rounded-lg`,children:[(0,m.jsx)(`span`,{children:`Total Amount`}),(0,m.jsxs)(`span`,{className:`text-primary`,children:[`₹`,e.total_amount]})]})]})}),(0,m.jsx)(`div`,{className:`px-6 pt-4 pb-0 space-y-6`,children:e.items?.map((e,t)=>(0,m.jsxs)(`div`,{className:`flex gap-6 items-start border border-primary/10 rounded-2xl p-4 hover:shadow-lg hover:border-primary/30 transition bg-white group-hover:bg-primary/5`,children:[(0,m.jsx)(`img`,{src:e.image,alt:e.product_name,className:`w-24 h-28 object-cover rounded-xl shadow-md border border-primary/10`,onError:e=>{e.target.src=`/placeholder.png`}}),(0,m.jsxs)(`div`,{className:`flex-1`,children:[(0,m.jsxs)(`div`,{className:`flex justify-between`,children:[(0,m.jsx)(`h3`,{className:`font-semibold text-lg text-primary-dark group-hover:text-primary transition`,children:e.product_name}),(0,m.jsxs)(`p`,{className:`font-bold text-primary text-lg bg-primary/10 px-3 py-1 rounded-lg`,children:[`₹`,e.price]})]}),(0,m.jsxs)(`div`,{className:`text-sm text-gray-600 mt-2 space-y-1`,children:[e.variant_color&&(0,m.jsxs)(`p`,{children:[`Color: `,e.variant_color]}),e.variant_size&&(0,m.jsxs)(`p`,{children:[`Size: `,e.variant_size]}),(0,m.jsxs)(`p`,{children:[`Quantity: `,e.quantity]})]})]})]},t))})]},e.id))})]})}),v&&g&&(0,m.jsx)(`div`,{className:`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4`,children:(0,m.jsxs)(`div`,{className:`bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col`,children:[(0,m.jsxs)(`div`,{className:`flex justify-between items-center px-8 py-6 bg-gradient-to-r from-primary-light to-secondary text-white`,children:[(0,m.jsx)(`h2`,{className:`text-2xl font-bold tracking-wide`,children:`Order Details`}),(0,m.jsx)(`button`,{onClick:()=>y(!1),className:`text-white text-2xl hover:scale-110 transition cursor-pointer`,children:`✕`})]}),(0,m.jsxs)(`div`,{className:`p-8 overflow-y-auto space-y-8`,children:[(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`h3`,{className:`text-lg font-bold text-primary-dark mb-4`,children:`Order Tracking`}),(0,m.jsx)(`div`,{className:`bg-white border border-gray-100 rounded-2xl p-6 shadow-sm`,children:(0,m.jsxs)(`div`,{className:`relative`,children:[(0,m.jsx)(`div`,{className:`absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200`}),(0,m.jsx)(`div`,{className:`space-y-6`,children:g.status?.toLowerCase()===`cancelled`?(0,m.jsxs)(`div`,{className:`relative flex items-center gap-4`,children:[(0,m.jsx)(`div`,{className:`w-12 h-12 rounded-full flex items-center justify-center z-10 bg-red-100 text-red-600`,children:(0,m.jsx)(s,{size:20})}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`h4`,{className:`font-bold text-red-600`,children:`Cancelled`}),(0,m.jsx)(`p`,{className:`text-xs text-red-500`,children:`Order was cancelled`})]})]}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsxs)(`div`,{className:`relative flex items-center gap-4`,children:[(0,m.jsx)(`div`,{className:`w-12 h-12 rounded-full flex items-center justify-center z-10 bg-green-100 text-[#0e6827]`,children:(0,m.jsx)(u,{size:20})}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`h4`,{className:`font-bold text-gray-800`,children:`Order Placed`}),(0,m.jsx)(`p`,{className:`text-xs text-gray-500`,children:`We have received your order`})]})]}),(0,m.jsxs)(`div`,{className:`relative flex items-center gap-4`,children:[(0,m.jsx)(`div`,{className:`w-12 h-12 rounded-full flex items-center justify-center z-10 ${[`packing`,`shipping`,`out for delivery`,`delivered`].includes(g.status?.toLowerCase())?`bg-green-100 text-[#0e6827]`:`bg-gray-100 text-gray-400`}`,children:(0,m.jsx)(u,{size:20})}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`h4`,{className:`font-bold ${[`packing`,`shipping`,`out for delivery`,`delivered`].includes(g.status?.toLowerCase())?`text-gray-800`:`text-gray-400`}`,children:`Packing`}),(0,m.jsx)(`p`,{className:`text-xs text-gray-500`,children:`Your order is being packed`})]})]}),(0,m.jsxs)(`div`,{className:`relative flex items-center gap-4`,children:[(0,m.jsx)(`div`,{className:`w-12 h-12 rounded-full flex items-center justify-center z-10 ${[`shipping`,`out for delivery`,`delivered`].includes(g.status?.toLowerCase())?`bg-green-100 text-[#0e6827]`:`bg-gray-100 text-gray-400`}`,children:(0,m.jsx)(d,{size:20})}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`h4`,{className:`font-bold ${[`shipping`,`out for delivery`,`delivered`].includes(g.status?.toLowerCase())?`text-gray-800`:`text-gray-400`}`,children:`Shipping`}),(0,m.jsx)(`p`,{className:`text-xs text-gray-500`,children:`Your order is on the way`})]})]}),(0,m.jsxs)(`div`,{className:`relative flex items-center gap-4`,children:[(0,m.jsx)(`div`,{className:`w-12 h-12 rounded-full flex items-center justify-center z-10 ${[`out for delivery`,`delivered`].includes(g.status?.toLowerCase())?`bg-green-100 text-[#0e6827]`:`bg-gray-100 text-gray-400`}`,children:(0,m.jsx)(d,{size:20})}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`h4`,{className:`font-bold ${[`out for delivery`,`delivered`].includes(g.status?.toLowerCase())?`text-gray-800`:`text-gray-400`}`,children:`Out for Delivery`}),(0,m.jsx)(`p`,{className:`text-xs text-gray-500`,children:`Your order is out for delivery`})]})]}),(0,m.jsxs)(`div`,{className:`relative flex items-center gap-4`,children:[(0,m.jsx)(`div`,{className:`w-12 h-12 rounded-full flex items-center justify-center z-10 ${g.status?.toLowerCase()===`delivered`?`bg-green-100 text-[#0e6827]`:`bg-gray-100 text-gray-400`}`,children:(0,m.jsx)(o,{size:20})}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`h4`,{className:`font-bold ${g.status?.toLowerCase()===`delivered`?`text-gray-800`:`text-gray-400`}`,children:`Delivered`}),(0,m.jsx)(`p`,{className:`text-xs text-gray-500`,children:`Order has been delivered`})]})]})]})})]})})]}),(0,m.jsxs)(`div`,{className:`print-area bg-white border border-gray-200 rounded-xl p-6 shadow-sm`,children:[(0,m.jsxs)(`div`,{className:`flex justify-between items-center mb-4`,children:[(0,m.jsx)(`h3`,{className:`font-bold text-lg text-gray-800`,children:`Order Summary`}),(0,m.jsxs)(`button`,{onClick:t,className:`flex items-center gap-1 text-xs bg-primary text-white px-3 py-1.5 rounded-md hover:opacity-90 transition`,children:[(0,m.jsx)(c,{className:`w-4 h-4`}),`Print`]})]}),(0,m.jsxs)(`div`,{className:`grid md:grid-cols-2 gap-y-3 gap-x-8 text-sm`,children:[(0,m.jsxs)(`div`,{className:`flex justify-between border-b border-primary/10 pb-2`,children:[(0,m.jsx)(`span`,{className:`text-gray-500`,children:`Order ID`}),(0,m.jsx)(`span`,{className:`font-semibold`,children:g.order_id||g.id})]}),(0,m.jsxs)(`div`,{className:`flex justify-between border-b border-primary/10 pb-2`,children:[(0,m.jsx)(`span`,{className:`text-gray-500`,children:`Date`}),(0,m.jsx)(`span`,{className:`font-semibold`,children:new Date(g.created_at).toLocaleDateString()})]}),(0,m.jsxs)(`div`,{className:`flex justify-between border-b border-primary/10 pb-2`,children:[(0,m.jsx)(`span`,{className:`text-gray-500`,children:`Status`}),(0,m.jsx)(h,{status:g.status})]}),(0,m.jsxs)(`div`,{className:`flex justify-between border-b border-primary/10 pb-2`,children:[(0,m.jsx)(`span`,{className:`text-gray-500`,children:`Customer`}),(0,m.jsx)(`span`,{className:`font-semibold`,children:g.customer_name})]}),g.tracking_number&&(0,m.jsxs)(`div`,{className:`flex justify-between border-b border-primary/10 pb-2`,children:[(0,m.jsx)(`span`,{className:`text-gray-500`,children:`Tracking ID`}),(0,m.jsx)(`span`,{className:`font-semibold text-primary-dark`,children:g.tracking_number})]}),g.courier_name&&(0,m.jsxs)(`div`,{className:`flex justify-between border-b border-primary/10 pb-2`,children:[(0,m.jsx)(`span`,{className:`text-gray-500`,children:`Courier`}),(0,m.jsx)(`span`,{className:`font-semibold text-primary-dark`,children:g.courier_name})]}),(0,m.jsxs)(`div`,{className:`flex justify-between border-b border-primary/10 pb-2`,children:[(0,m.jsx)(`span`,{className:`text-gray-500`,children:`Phone`}),(0,m.jsx)(`span`,{className:`font-semibold`,children:g.customer_phone})]}),(0,m.jsxs)(`div`,{className:`flex justify-between text-base font-bold pt-2`,children:[(0,m.jsx)(`span`,{children:`Total Amount`}),(0,m.jsxs)(`span`,{className:`text-primary`,children:[`₹`,g.total_amount]})]})]})]}),b?(0,m.jsx)(`div`,{className:`flex justify-center py-16`,children:(0,m.jsx)(`div`,{className:`animate-spin h-12 w-12 border-b-2 border-primary rounded-full`})}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`h3`,{className:`text-lg font-bold text-primary-dark mb-4`,children:`Shipping Address`}),(0,m.jsx)(`div`,{className:`border border-gray-100 rounded-2xl p-6 bg-gradient-to-br from-primary/5 to-transparent shadow-sm`,children:g?(()=>{let e=g.shipping_address;if(typeof e==`string`)try{e=JSON.parse(e)}catch{}let t=e?.customer_name||g.customer_name,n=e?.street_address||g.street_address,r=e?.city||g.city,i=e?.district||g.district,a=e?.state||g.state,o=e?.zip_code||g.zip_code,s=e?.country||g.country,c=e?.customer_phone||g.customer_phone,l=e?.customer_email||g.customer_email;return(0,m.jsxs)(`div`,{className:`text-sm text-gray-700 space-y-1`,children:[(0,m.jsx)(`p`,{className:`font-semibold`,children:t||`N/A`}),(0,m.jsx)(`p`,{children:n}),(0,m.jsxs)(`p`,{children:[r,`, `,i]}),(0,m.jsxs)(`p`,{children:[a,` `,o?`- ${o}`:``]}),(0,m.jsx)(`p`,{children:s}),(0,m.jsxs)(`p`,{children:[`Phone: `,c]}),(0,m.jsxs)(`p`,{children:[`Email: `,l]})]})})():(0,m.jsx)(`p`,{className:`text-gray-500`,children:`Address not available`})})]}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`h3`,{className:`text-lg font-bold text-primary-dark mb-4`,children:`Expanded Order Summary`}),(0,m.jsxs)(`div`,{className:`bg-[#f8faec] border border-green-100 rounded-2xl p-6 shadow-sm`,children:[(0,m.jsxs)(`div`,{className:`space-y-3 text-sm text-gray-700`,children:[(0,m.jsxs)(`div`,{className:`flex justify-between items-center`,children:[(0,m.jsx)(`span`,{className:`font-medium`,children:`Subtotal (Before Discount)`}),(0,m.jsxs)(`span`,{className:`font-bold`,children:[`₹`,g.subtotal_before_discount||g.total_amount]})]}),g.coupon_code&&(0,m.jsxs)(`div`,{className:`flex justify-between items-center text-green-700`,children:[(0,m.jsxs)(`span`,{className:`font-medium`,children:[`Coupon Discount (`,g.coupon_code,`)`]}),(0,m.jsxs)(`span`,{className:`font-bold`,children:[`-₹`,g.coupon_discount||0]})]}),(0,m.jsxs)(`div`,{className:`flex justify-between items-center`,children:[(0,m.jsx)(`span`,{className:`font-medium`,children:`Delivery Method`}),(0,m.jsx)(`span`,{className:`font-bold capitalize`,children:g.delivery_method||`delivery`})]}),(0,m.jsxs)(`div`,{className:`flex justify-between items-center text-gray-600`,children:[(0,m.jsx)(`span`,{className:`font-medium`,children:`Delivery Charges`}),(0,m.jsx)(`span`,{className:`font-bold`,children:g.delivery_charge>0?`₹${g.delivery_charge}`:`Free`})]})]}),(0,m.jsxs)(`div`,{className:`mt-4 pt-4 border-t border-green-200 flex justify-between items-center`,children:[(0,m.jsx)(`span`,{className:`text-lg font-bold text-primary-dark`,children:`Total Paid`}),(0,m.jsxs)(`span`,{className:`text-xl font-bold text-[#0e6827]`,children:[`₹`,g.total_amount]})]})]})]}),(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`h3`,{className:`text-lg font-bold text-primary-dark mb-4`,children:`Products`}),(0,m.jsx)(`div`,{className:`space-y-5`,children:g.items&&g.items.length>0?g.items.map((e,t)=>{let n=e.price*e.quantity;return(0,m.jsxs)(`div`,{className:`flex gap-5 border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition`,children:[(0,m.jsx)(`img`,{src:e.image,alt:e.product_name,className:`w-24 h-28 object-cover rounded-xl`,onError:e=>{e.target.src=`/placeholder.png`}}),(0,m.jsxs)(`div`,{className:`flex-1`,children:[(0,m.jsxs)(`div`,{className:`flex justify-between`,children:[(0,m.jsx)(`h4`,{className:`font-semibold text-lg text-primary-dark`,children:e.product_name}),(0,m.jsxs)(`p`,{className:`font-bold text-primary text-lg`,children:[`₹`,e.price]})]}),(0,m.jsxs)(`div`,{className:`text-sm text-gray-600 mt-3 space-y-1`,children:[(e.color||e.variant_color)&&(0,m.jsxs)(`p`,{children:[(0,m.jsx)(`span`,{className:`font-medium`,children:`Color:`}),` `,e.color||e.variant_color]}),(e.size||e.variant_size)&&(0,m.jsxs)(`p`,{children:[(0,m.jsx)(`span`,{className:`font-medium`,children:`Size:`}),` `,e.size||e.variant_size]}),(0,m.jsxs)(`p`,{children:[(0,m.jsx)(`span`,{className:`font-medium`,children:`Quantity:`}),` `,e.quantity]}),(0,m.jsxs)(`p`,{children:[(0,m.jsx)(`span`,{className:`font-medium`,children:`Subtotal:`}),` `,`₹`,n]})]})]})]},t)}):(0,m.jsx)(`p`,{className:`text-gray-500 text-center py-6`,children:`No items in this order`})})]}),(0,m.jsxs)(`div`,{className:`mt-6 border-t border-gray-100 pt-6 flex justify-between items-center`,children:[(0,m.jsxs)(`p`,{className:`text-xl font-bold text-primary-dark`,children:[`Total: ₹`,g.total_amount]}),(0,m.jsx)(`button`,{onClick:()=>y(!1),className:`bg-gradient-to-r from-primary to-secondary text-white px-8 py-2.5 rounded-xl font-semibold shadow-md hover:opacity-90 transition`,children:`Close`})]})]})]})]})}),(0,m.jsx)(`style`,{children:`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        `})]})};export{g as default};