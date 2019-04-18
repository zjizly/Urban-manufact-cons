const path = require("path");
const fs = require("fs");
const os = require("os");

const args = process.argv;
const fsName = args[2] || undefined;  // 新页面文件夹
if( fsName === undefined ) {
    console.log("缺少参数：页面文件名");
    return;
}
const pageName = convert(fsName); // 新页面(类)名
const storeFsName = fsName+"-store";
const storeClassName = convert(storeFsName);
const storeName = store(storeClassName);
const routeName = store(pageName);

const basePath = path.dirname(__dirname);
const scss = path.join(__dirname,"temp","style.temp");
const css = path.join(__dirname,"temp","style.temp");
const storeTemp = path.join(__dirname,"temp","store.temp");
const index = path.join(__dirname,"temp","index.temp");
const stores = path.join(basePath,"src","index.tsx");
const routes = path.join(basePath,"src","routes","index.tsx");
const app = path.join(basePath,"src","pages","app","index.tsx");

var scssStr = fs.readFileSync(scss,{encoding: "utf-8"});
var indexStr = fs.readFileSync(index,{encoding: "utf-8"});
var storeTempStr = fs.readFileSync(storeTemp,{encoding: "utf-8"});
var storeStr = fs.readFileSync(stores,{encoding: "utf-8"});
var routeStr = fs.readFileSync(routes,{encoding: "utf-8"});
var appStr = fs.readFileSync(app,{encoding: "utf-8"});

const rclass = new RegExp("--class--", "g");
const rstore = new RegExp("&store&", "g");
const rcomp = new RegExp("&comp&", "g");
indexStr = indexStr.replace(rstore,storeName);
indexStr = indexStr.replace(rclass,storeClassName);
indexStr = indexStr.replace(rcomp,pageName);
indexStr = indexStr.replace("*page*",fsName);
indexStr = indexStr.replace("&fs&",storeFsName);
scssStr = scssStr.replace( "&class&", fsName+"-page" );

storeTempStr = storeTempStr.replace(rclass,storeClassName);
storeTempStr = storeTempStr.replace(rstore,storeName);

storeStr = `import { ${storeName} } from './stores/${storeFsName}';${os.EOL}${storeStr}`;
storeStr = insert(storeStr,storeName+","+os.EOL,storeStr.lastIndexOf("netStore"));
routeStr = `${routeStr}${os.EOL}export const ${pageName} = generateLoadable(() => import('../pages/${fsName}'));`
let appInsert = `${os.EOL}          <RouteGuard path="/${routeName}" component={routes.${pageName}}/>`;
appStr = insert(appStr,appInsert,appStr.lastIndexOf("<Switch>")+8);

const pagePath = path.join(basePath,"src","pages",fsName);
try{
    fs.mkdirSync(pagePath);
}catch(e){
    console.log("文件夹已存在！");
    return;
}
fs.writeFileSync(path.join(pagePath,"index.tsx"),Buffer.from(indexStr));
fs.writeFileSync(path.join(pagePath,"style.scss"),Buffer.from(scssStr));
fs.writeFileSync(path.join(pagePath,"style.css"),"");
fs.writeFileSync(path.join(basePath,"src","stores",storeFsName+".ts"),Buffer.from(storeTempStr));
fs.writeFileSync(stores,Buffer.from(storeStr));
fs.writeFileSync(routes,Buffer.from(routeStr));
fs.writeFileSync(app,Buffer.from(appStr));

console.log(`success! --${pageName}`);


function titleCase(s) {  
    var i, ss = s.toLowerCase().split(/\s+/);  
    for (i = 0; i < ss.length; i++) {  
        ss[i] = ss[i].slice(0, 1).toUpperCase() + ss[i].slice(1);  
    }  
    return ss.join('');
}

function convert(str){
    let arr = str.split("-");
    arr = arr.map((s)=>{return titleCase(s)});
    return arr.join("");
}

function store(name){
    let arr = name.split("");
    arr[0] = arr[0].toLowerCase();
    return arr.join("");
}

function insert(str,item,index){
    var newstr="";  
    var tmp=str.substring(0,index);
    var estr=str.substring(index,str.length);
    newstr+=tmp+item+estr;
    return newstr;
}