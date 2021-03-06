const App = class{
    constructor(_parent = err()){
        prop(this,{_parent, _table:new Map});
    }
    add(k = err(), controller = err()){
        k = k.split(':');
        this._table.set(k[0], controller).set(`${k[0]}:base`, controller);
        if(k[1]) k[1].split(',').forEach(v=>this._table.set(`${k[0]}:${v}`, controller));
    }
    route(path = err(), ...arg){
        const [k, action = 'base'] = path.split(':');
        if(!this._table.has(k)) return;
        const controller = this._table.get(k)();
        append(attr(sel(this._parent), 'innerHTML', ''), controller[action](...arg));
    }
};
const Singleton = class extends WeakMap{
    has(){err();}
    get(){err();}
    set(){err();}
    getInstance(v){
        if(!super.has(v.constructor)) super.set(v.constructor, v);
        return super.get(v.constructor);
    }
};
const singleton = new Singleton;
const Model = class extends Set{
    constructor(isSingleton){
        super();
        if(isSingleton) return singleton.getInstance(this);
    }
    add(){err();}
    delete(){err();}
    has(){err();}
    hasController(v){
        if(!is(v, Controller)) err();
        return super.has(v);
    }
    addController(v){
        if(!is(v, Controller)) err();
        super.add(v);
    }
    removeController(v){
        if(!is(v, Controller)) err();
        super.delete(v);
    }
    notify(){
        this.forEach(v=>v.listen(this));
    }
};
const Controller = class{
    constructor(isSingleton){
        if(isSingleton) return singleton.getInstance(this);
    }
    listen(model){}
};
const View = class{
    constructor(_controller = err(), isSingleton = false){
        prop(this, {_controller});
        if(isSingleton) return singleton.getInstance(this);
    }
    render(model = null){override();}
};
const HomeDetailModel = class extends Model{
    constructor(_id = err(), title = err(), memo = ''){
        super();
        prop(this, {_id});
        this.edit(title, memo);
    }
    edit(_title = '', _memo = ''){
        prop(this, {_title, _memo});
        this.notify();
    }
    get title(){return this._title;}
    get id(){return this._id;}
    get memo(){return this._memo;}
};
const HomeModel = class extends Model{
    constructor(isSingleton){
        super(isSingleton);
        if(!this._list) prop(this, {_list:[
            new HomeDetailModel(1, 'todo1', 'memo1'),
            new HomeDetailModel(2, 'todo2', 'memo2'),
            new HomeDetailModel(3, 'todo3', 'memo3'),
            new HomeDetailModel(4, 'todo4', 'memo4'),
            new HomeDetailModel(5, 'todo5', 'memo1')
        ]});
    }
    get list(){return this._list;}
    add(...v){this._list.push(...v);}
    remove(id){
        const {_list:list} = this;
        if(!list.some((v, i)=>{
            if(v.id == id){
                list.splice(i, 1);
                return true;
            }
        })) err();
        this.notify();
    }
    get(id){
        let result;
        if(!this._list.some(v=>v.id == id ? (result = v) : false)) err();
        return result;
    }
};

const HomeBaseView = class extends View{
    constructor(controller, isSingleton){
        super(controller, isSingleton);
    }
    render(model = err()){
        if(!is(model, HomeModel)) err();
        const {_controller:ctrl} = this;
        return append(el('ul'), ...model.list.map(v=>append(
            el('li'),
            el('a', 'innerHTML', v.title, 'addEventListener', ['click', _=>ctrl.$detail(v.id)]),
            el('button', 'innerHTML', 'x', 'addEventListener', ['click', _=>ctrl.$remove(v.id)])
        )));
    }
};
const HomeDetailView = class extends View{
    constructor(controller, isSingleton){
        super(controller, isSingleton);
    }
    render(model = err()){
        if(!is(model, HomeDetailModel)) err();
        const {_controller:ctrl} = this;
        const sec = el('section');
        return append(sec,
            el('input', 'value', model.title, '@cssText', 'display:block', 'className', 'title'),
            el('textarea', 'innerHTML', model.memo, '@cssText', 'display:block', 'className', 'memo'),
            el('button', 'innerHTML', 'edit', 'addEventListener', ['click', _=>ctrl.$editDetail(model.id, sel('.title', sec).value, sel('.memo', sec).value)]),
            el('button', 'innerHTML', 'delete', 'addEventListener', ['click', _=>ctrl.$removeDetail(model.id)]),
            el('button', 'innerHTML', 'list', 'addEventListener', ['click', _=>ctrl.$list()])
        );
    }
};
const Home = class extends Controller{
    constructor(isSingleton){
        super(isSingleton);
    }
    
    $detail(id){app.route('home:detail', id);}
    listen(model){
        switch(true){
        case is(model, HomeModel):return this.$list();
        case is(model, HomeDetailModel):return this.$detail(model.id);
        }
    }
    detail(id){
        const view = new HomeDetailView(this, true);
        const model = new HomeModel(true).get(id);
        model.addController(this);
        return view.render(model);
    }
    $removeDetail(id){
        this.$remove(id);
    }
    $editDetail(id, title, memo){
        const model = new HomeModel(true).get(id);
        model.addController(this);
        model.edit(title, memo);
    }

    base(){
        const view = new HomeBaseView(this, true);
        const model = new HomeModel(true);
        model.addController(this);
        return view.render(model);
    }    
    $remove(id){
        const model = new HomeModel(true);
        model.remove(id);        
    }
    $list(){app.route('home');}
    
}
const app = new App('#stage');
app.add('home:detail', _=>new Home(true));
app.route('home');