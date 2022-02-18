//storage
let collectedSheetDB=[]; //contain all sheetDB
let sheetDB=[];
{
    let addSheetBtn=document.querySelector(".sheet-add-icon");
    addSheetBtn.click();
    
}
// for(let i=0;i<rows;i++){
//     let sheetRow=[];
//     for(let j=0;j<col;j++){
//         let cellProp={
//             bold:false,
//             italic:false,
//             underline:false,
//             alignment: "left",
//             fontFamily:"monospace",
//             fontSize:"14",
//             fontColor:"#000000",
//             BGColor:"#000000", //just for indication purpose(default value)
//             value:"",
//             formula:"",
//             children:[],
//         }
//         sheetRow.push(cellProp)
//     }
//     sheetDB.push(sheetRow)
// }

//selectors for cell properties
let bold=document.querySelector(".bold")
let italic=document.querySelector(".italic")
let underline=document.querySelector(".underline")
let fontSize=document.querySelector(".font-size-prop")
let fontFamily=document.querySelector(".font-family-prop")
let fontColor=document.querySelector(".font-color-prop")
let BGColor=document.querySelector(".BGcolor-prop")
//console.log(BGColor)
let alignment=document.querySelectorAll(".alignment")
let leftAlign=alignment[0];
let centerAlign=alignment[1];
let rightAlign=alignment[2];

let activeColorProp= "#d1d8e0";
let inactiveColorProp="#ecf0f1";

// Application of Two way binding
//Attach property listener
bold.addEventListener("click",(e)=>{
    let address=addressBar.value
    let [cell,cellProp]=activecell(address)

    //Modification
    cellProp.bold=!cellProp.bold;//Data Change
    cell.style.fontWeight=cellProp.bold ? "bold":"normal"; //UI change (1)
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp 

})
italic.addEventListener("click",(e)=>{
    let address=addressBar.value
    let [cell,cellProp]=activecell(address)

    //Modification
    cellProp.italic=!cellProp.italic;//Data Change
    cell.style.fontStyle=cellProp.italic ? "italic":"normal"; //UI change (1)
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp 

})

underline.addEventListener("click",(e)=>{
    let address=addressBar.value
    let [cell,cellProp]=activecell(address)

    //Modification
    cellProp.underline=!cellProp.underline;//Data Change
    cell.style.textDecoration=cellProp.underline ? "underline":"none"; //UI change (1)
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp 

})
fontSize.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp]=activecell(address);
    
    cellProp.fontSize=fontSize.value;//data change
    cell.style.fontSize=cellProp.fontSize + "px";
    fontSize.value=cellProp.fontSize
})   
fontFamily.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp]=activecell(address);
    cellProp.fontFamily=fontFamily.value;//data change
    cell.style.fontFamily=cellProp.fontFamily;
    fontFamily.value=cellProp.fontFamily
})   
fontColor.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp]=activecell(address);
    cellProp.fontColor=fontColor.value;//data change
    cell.style.color=cellProp.fontColor;
    fontColor.value=cellProp.fontColor
})  
BGColor.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp]=activecell(address);
    cellProp.BGColor=BGColor.value;//data change
    cell.style.backgroundColor=cellProp.BGColor;
    BGColor.value=cellProp.BGColor
})  
alignment.forEach((alignElem)=>{
    alignElem.addEventListener("click",(e)=>{
        let address = addressBar.value;
        let [cell,cellProp]=activecell(address);

        let alignValue=e.target.classList[0];
        cellProp.alignment=alignValue; //Data change
        cell.style.textAlign=cellProp.alignment; //UI change
        switch(alignValue){ //UI change
            case "left":
                leftAlign.style.backgroundColor=activeColorProp;
                centerAlign.style.backgroundColor=inactiveColorProp;
                rightAlign.style.backgroundColor=inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor=inactiveColorProp;
                centerAlign.style.backgroundColor=activeColorProp;
                rightAlign.style.backgroundColor=inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor=inactiveColorProp;
                centerAlign.style.backgroundColor=inactiveColorProp;
                rightAlign.style.backgroundColor=activeColorProp;
                break;

        }
       
    })
})
let allCells =document.querySelectorAll(".cell")
for(let i=0;i<allCells.length;i++){
        addListenerToAttachCellProperties(allCells[i]);
    }
function addListenerToAttachCellProperties(cell){
    cell.addEventListener("click",(e)=>{
        let address=addressBar.value;
        let [rid,cid]=decodeRIDCIDFromAddress(address);
        let cellProp=sheetDB[rid][cid];
        //Apply cell properties
        cell.style.fontWeight=cellProp.bold ? "bold":"normal";
        cell.style.fontStyle=cellProp.italic ? "italic":"normal"; 
        cell.style.textDecoration=cellProp.underline ? "underline":"none";
        cell.style.fontSize=cellProp.fontSize + "px";
        cell.style.fontFamily=cellProp.fontFamily;
        cell.style.color=cellProp.fontColor;
        cell.style.backgroundColor=cellProp.BGColor === "#000000"?"transparent":cellProp.BGColor;
        cell.style.textAlign=cellProp.alignment;
        
        // Apply properties to ui container
        bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp 
        italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp 
        underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp 
        fontSize.value=cellProp.fontSize
        fontFamily.value=cellProp.fontFamily
        fontColor.value=cellProp.fontColor
        BGColor.value=cellProp.BGColor
        switch(cellProp.alignment){ //UI change
            case "left":
                leftAlign.style.backgroundColor=activeColorProp;
                centerAlign.style.backgroundColor=inactiveColorProp;
                rightAlign.style.backgroundColor=inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor=inactiveColorProp;
                centerAlign.style.backgroundColor=activeColorProp;
                rightAlign.style.backgroundColor=inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor=inactiveColorProp;
                centerAlign.style.backgroundColor=inactiveColorProp;
                rightAlign.style.backgroundColor=activeColorProp;
                break;

        }
        let formulaBar=document.querySelector(".formula-bar")
        formulaBar.value=cellProp.formula
        cell.innerText=cellProp.value
        //cell.value=cellProp.value
    })
}

function activecell(address){
  let [rid,cid] = decodeRIDCIDFromAddress(address)
  //Access cell & Storage
  let cell=document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
  let cellProp=sheetDB[rid][cid];
  
  return [cell,cellProp];
}
function decodeRIDCIDFromAddress(address){
    //address -> "A1"
    let rid=Number(address.slice(1)-1); //"1" -> 0
    let cid=Number(address.charCodeAt(0)) - 65;
    return [rid,cid] // "A" -> 65
}