"use strict";(self.webpackChunkangular_test_task=self.webpackChunkangular_test_task||[]).push([[767],{767:(b,a,r)=>{r.r(a),r.d(a,{LoginModule:()=>Z});var u=r(6814),s=r(383),i=r(95),d=r(1374),g=r(6306),f=r(8504),t=r(4769),p=r(8333),m=r(2925);function h(o,l){if(1&o&&(t.TgZ(0,"div",10),t._uU(1),t.qZA()),2&o){const n=t.oxw();t.xp6(1),t.hij(" ",n.error," ")}}const v=[{path:"",component:(()=>{class o{constructor(n,e,c){this.formBuilder=n,this.router=e,this.authService=c,this.submitted=!1}ngOnInit(){this.form=this.formBuilder.group({email:this.formBuilder.control(null,{validators:[i.kI.required,i.kI.email]}),password:this.formBuilder.control(null,{validators:[i.kI.required,i.kI.minLength(6),i.kI.maxLength(10)]})}),this.authService.isLoggedIn()&&this.router.navigate(["/products"])}logIn(){if(!this.form.valid)return void(this.submitted=!0);const n=this.form.getRawValue();this.authService.login(n).pipe((0,d.P)(),(0,g.K)(e=>(this.error=e,(0,f._)(e)))).subscribe(e=>{this.authService.manageLocalStorage(e),this.authService.isUserLoggedIn.set(!0),this.router.navigate(["/products"])})}}return o.\u0275fac=function(n){return new(n||o)(t.Y36(i.qu),t.Y36(s.F0),t.Y36(p.e))},o.\u0275cmp=t.Xpm({type:o,selectors:[["app-login"]],decls:13,vars:7,consts:[[1,"container"],[1,"row","mt-5"],[1,"col-lg-6","col-md-8","col-10","m-auto","d-flex","flex-column","align-items-center","p-lg-4","p-md-3","p-2",3,"formGroup"],[1,"m-auto","mb-3"],[1,"mb-3","col-12"],["label","Email","controlName","email","controlNamePrefix","login",3,"form","submitted"],["label","Password","controlName","password","controlNamePrefix","login","type","password",3,"form","showIcon","submitted"],["class","alert alert-danger col-12","role","alert",4,"ngIf"],[1,"col-lg-5","col-8","m-auto","my-3","align-self-start"],["type","button",1,"btn","btn-primary","col-12",3,"click"],["role","alert",1,"alert","alert-danger","col-12"]],template:function(n,e){1&n&&(t.TgZ(0,"div",0)(1,"div",1)(2,"form",2)(3,"h1",3),t._uU(4,"Login"),t.qZA(),t.TgZ(5,"div",4),t._UZ(6,"app-text-input",5),t.qZA(),t.TgZ(7,"div",4),t._UZ(8,"app-text-input",6),t.qZA(),t.YNc(9,h,2,1,"div",7),t.TgZ(10,"div",8)(11,"button",9),t.NdJ("click",function(){return e.logIn()}),t._uU(12,"Log in"),t.qZA()()()()()),2&n&&(t.xp6(2),t.Q6J("formGroup",e.form),t.xp6(4),t.Q6J("form",e.form)("submitted",e.submitted),t.xp6(2),t.Q6J("form",e.form)("showIcon",!0)("submitted",e.submitted),t.xp6(1),t.Q6J("ngIf",e.error))},dependencies:[u.O5,i._Y,i.JL,i.sg,m.t]}),o})()}];let L=(()=>{class o{}return o.\u0275fac=function(n){return new(n||o)},o.\u0275mod=t.oAB({type:o}),o.\u0275inj=t.cJS({imports:[s.Bz.forChild(v),s.Bz]}),o})();var I=r(8404);let Z=(()=>{class o{}return o.\u0275fac=function(n){return new(n||o)},o.\u0275mod=t.oAB({type:o}),o.\u0275inj=t.cJS({imports:[u.ez,L,i.u5,i.UX,m.t,I.f]}),o})()}}]);