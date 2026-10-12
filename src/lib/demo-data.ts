export type ExperimentStatus = 'completed'|'running'|'failed'
export type Experiment = {id:string;name:string;method:string;seed:number;score:number|null;status:ExperimentStatus;updated:string}
export const initialExperiments:Experiment[]=[
 {id:'EXP-024',name:'Robust representation / baseline',method:'Baseline',seed:42,score:92.4,status:'completed',updated:'2026-10-12'},
 {id:'EXP-023',name:'Adaptive design / ablation',method:'Adaptive',seed:17,score:94.8,status:'completed',updated:'2026-10-11'},
 {id:'EXP-022',name:'Learning under perturbation',method:'Robust',seed:64,score:null,status:'running',updated:'2026-10-11'},
 {id:'EXP-021',name:'Representation / stress test',method:'Robust',seed:8,score:93.1,status:'completed',updated:'2026-10-10'},
 {id:'EXP-020',name:'Adaptive design / pilot',method:'Adaptive',seed:23,score:null,status:'failed',updated:'2026-10-09'},
]
