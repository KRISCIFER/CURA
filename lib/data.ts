export const medicines = [
 {id:'paracetamol',name:'Paracetamol',strength:'500 mg',form:'Tablet',brand:'Calpol · Crocin',rx:false,stock:124,demand:18,expiry:180},
 {id:'ors',name:'ORS',strength:'21.8 g',form:'Sachet',brand:'Electral',rx:false,stock:28,demand:12,expiry:240},
 {id:'amoxicillin',name:'Amoxicillin',strength:'500 mg',form:'Capsule',brand:'Mox',rx:true,stock:44,demand:0.7,expiry:18},
 {id:'cetirizine',name:'Cetirizine',strength:'10 mg',form:'Tablet',brand:'Cetzine',rx:false,stock:86,demand:8,expiry:320},
 {id:'metformin',name:'Metformin',strength:'500 mg',form:'Tablet',brand:'Glycomet',rx:true,stock:9,demand:6,expiry:150}
];
export const pharmacies = [
 {id:'apollo',name:'Apollo Pharmacy',area:'Connaught Place, Block C',distance:0.8,confidence:94,updated:'3 min',units:12,open:true,x:43,y:48},
 {id:'healthpoint',name:'HealthPoint Pharmacy',area:'Barakhamba Road',distance:1.2,confidence:91,updated:'6 min',units:24,open:true,x:63,y:54},
 {id:'medplus',name:'MedPlus',area:'Gole Market',distance:1.7,confidence:78,updated:'24 min',units:3,open:true,x:27,y:32},
 {id:'wellness',name:'Wellness Forever',area:'Mandi House',distance:2.4,confidence:54,updated:'9 hours',units:0,open:false,x:72,y:72}
];
export type Reservation={id:string;medicine:string;pharmacy:string;qty:number;window:string;status:'Pending confirmation'|'Ready for pickup'|'Completed'|'Cancelled';expires:number};
export type DemoState={reservations:Reservation[];stocks:Record<string,number>;shock:number;name:string;notifications:boolean;neighbourhood:string;events:string[]};
export const initial:DemoState={reservations:[],stocks:Object.fromEntries(medicines.map(m=>[m.id,m.stock])),shock:0,name:'Alex Morgan',notifications:true,neighbourhood:'Connaught Place',events:[]};
// Replace this browser-local adapter with API calls without changing the UI.
export const demoService={load():DemoState {try{return {...initial,...JSON.parse(localStorage.getItem('cura-v1')||'null')}}catch{return initial}},save(s:DemoState){localStorage.setItem('cura-v1',JSON.stringify(s))},search(q:string){const normalized=q.toLowerCase().replace(/[^a-z]/g,'');return medicines.filter(m=>[m.name,m.brand,m.id].some(s=>s.toLowerCase().replace(/[^a-z]/g,'').includes(normalized)) || (normalized.length>3 && m.name.toLowerCase().startsWith(normalized.slice(0,4))))}};
