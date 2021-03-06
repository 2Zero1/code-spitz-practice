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
console.log(1);
console.log(attr(sel(this._parent), 'innerHTML', ''));
        
        append(attr(sel(this._parent), 'innerHTML', ''), controller[action](...arg));
console.log(1);

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
        if(isSingleton) return prop(singleton.getInstance(this), {_controller});
        prop(this, {_controller});
    }
    render(model = null){override();}
};
const HomeDetailModel = class extends Model{
    constructor(_id = err(), _title = err(), _memo = ''){
        super();
        prop(this, {_title, _id, _memo});
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
    get list(){return [...this._list];}
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
        return append(el('section'),
            el('h2', 'innerHTML', model.title),
            el('p', 'innerHTML', model.memo),
            el('button', 'innerHTML', 'delete', 'addEventListener', ['click', _=>ctrl.$removeDetail(model.id)]),
            el('button', 'innerHTML', 'list', 'addEventListener', ['click', _=>ctrl.$list()])
        );
    }
};
const Home = class extends Controller{
    constructor(isSingleton){
        super(isSingleton);
    }
    base(){
        const view = new HomeBaseView(this, true);
        const model = new HomeModel(true);
        return view.render(model);
    }
    $detail(id){app.route('home:detail', id);}
    $remove(id){
        const model = new HomeModel(true);
        model.remove(id);
        this.$list();
    }
    detail(id){
        const view = new HomeDetailView(this, true);
        const model = new HomeModel(true);
        return view.render(model.get(id));
    }
    $list(){app.route('home');}
    $removeDetail(id){
        this.$remove(id);
        this.$list();
    }
}

const app = new App('#stage');
app.add('home:detail', _=>new Home(true));
app.route('home');
