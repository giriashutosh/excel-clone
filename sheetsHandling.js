let activeSheetColor="#ced6e0";
let sheetsFolderCont=document.querySelector(".sheet-folder-cont")
let addSheetBtn=document.querySelector(".sheet-add-icon");
addSheetBtn.addEventListener("click",(e)=>{
    //console.log("clicked")
    let sheet = document.createElement("div");
    sheet.setAttribute("class","sheet-folder");
    let allSheetFolders=document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id",allSheetFolders.length)
    sheet.innerHTML=`<div class="sheet-content">Sheet ${allSheetFolders.length+1}</div>`;
    //console.log(sheet.innerHTML)
    sheetsFolderCont.appendChild(sheet)
    sheet.scrollIntoView();
    //DB
    createSheetDB()
    createGraphComponentMatrix()
    handleSheetActiveness(sheet)
    handleSheetRemoval(sheet);
    sheet.click()
})
function handleSheetRemoval(sheet){
    sheet.addEventListener("mousedown",(e)=>{
        //Right click
        if(e.button!==2) return;
        let allSheetFolders=document.querySelectorAll(".sheet-folder");
        if(allSheetFolders.length===1){
            alert("You need to have atleast one sheet!!");
            return;
        }
        let response=confirm("Your sheet will be removed permanently,Are you sure?");
        if(response === false) return;

        let sheetIdx=Number(sheet.getAttribute("id"));
        //DB remove
        collectedSheetDB.splice(sheetIdx,1)
        collectedGraphComponent.splice(sheetIdx,1)
        //UI remove
        handleSheetUIRemoval(sheet)

        //By default bring sheet 1 to active
        sheetDB=collectedSheetDB[0];
        graphComponentMatrix=collectedGraphComponent[0];
        handleSheetProperties();
    })
}

function handleSheetUIRemoval(sheet){
    sheet.remove()
    let allSheetFolders=document.querySelectorAll(".sheet-folder");
    for(let i=0;i<allSheetFolders.length;i++){
        allSheetFolders[i].setAttribute("id",i);
        let sheetContent=allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText=`sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor="transparent";
    }
    allSheetFolders[0].style.backgroundColor=activeSheetColor;
}
function handleSheetDB(sheetIdx){
    sheetDB=collectedSheetDB[sheetIdx];
    graphComponentMatrix=collectedGraphComponent[sheetIdx];
}
function handleSheetProperties(){
    for(let i=0;i<rows;i++){
        for(let j=0;j<col;j++){
            let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click()
        }
    }
    //By default click on first cell via DOM
    let firstCell=document.querySelector(".cell")
    firstCell.click()
}
function handleSheetUI(sheet){
    let allSheetFolders=document.querySelectorAll(".sheet-folder");
    for(let i=0;i<allSheetFolders.length;i++){
        allSheetFolders[i].style.backgroundColor="transparent";
    }
    sheet.style.backgroundColor=activeSheetColor;
}
function handleSheetActiveness(sheet){
    sheet.addEventListener("click",(e)=>{
        let sheetIdx=Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);
        handleSheetProperties();
        handleSheetUI(sheet);
    })
}
function createSheetDB(){
    let sheetDB=[];
    for(let i=0;i<rows;i++){
    let sheetRow=[];
    for(let j=0;j<col;j++){
        let cellProp={
            bold:false,
            italic:false,
            underline:false,
            alignment: "left",
            fontFamily:"monospace",
            fontSize:"14",
            fontColor:"#000000",
            BGColor:"#000000", //just for indication purpose(default value)
            value:"",
            formula:"",
            children:[],
        }
        sheetRow.push(cellProp)
    }
    sheetDB.push(sheetRow)
}
 collectedSheetDB.push(sheetDB)
}

function createGraphComponentMatrix(){
    let graphComponentMatrix=[];

    for(let i=0;i<rows;i++){
    let row=[];
    for(let j=0;j<col;j++){
        //Why array-> More than 1 child relation (dependency)
        row.push([]);
        
    }
    graphComponentMatrix.push(row);
}
 collectedGraphComponent.push(graphComponentMatrix)
}