for(let i=0;i<rows;i++){
    for(let j=0;j<col;j++){
        let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur",(e)=>{
            let address=addressBar.value;
            let [extractedcell,cellProp]=activecell(address);
            let enteredData=extractedcell.innerText;
            if (enteredData === cellProp.value) return;
            cellProp.value=enteredData;
            //if data modifies remove P-C relation, formula empty, update children with new hardcoded (modified) value
            removeChildFromParent(cellProp.formula)
            cellProp.formula="";
            //cellProp.value=""
            updateChldrenCells(address)
        })
    }
}

let formulaBar=document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown",async (e)=>{
    let inputFormula=formulaBar.value;
    if(e.key === "Enter" && inputFormula){
        

        //If change in formula, break old P-C relation,evaluate new formula, add new P-C relation
        let address=addressBar.value;
        let [cell,cellProp]=activecell(address);
        if(inputFormula !== cellProp.formula){
            removeChildFromParent(cellProp.formula);
        }
        addChildToGraphComponent(inputFormula,address);
        //Check formula  is cyclic or not, then only evaluate
        //True -> cycle,False -> Not Cyclic
        let cycleResponse=isGraphCyclic(graphComponentMatrix);
        if(cycleResponse){
            //alert("Your formula is cyclic");
            let response=confirm("Your formula is cyclic. Do you want to trace your path?")
            while(response === true){
                //keep on tracking color until user is satisfied
                await isGraphCyclicTracePath(graphComponentMatrix,cycleResponse);// I want to complete full iteration of color tracking, so I will attach wait here also.
                response=confirm("Your formula is cyclic. Do you want to trace your path?")
            }
            removeChildFromGraphComponent(inputFormula,address);
            return;
        }
        let evaluatedValue=evaluateFormula(inputFormula);
        
        //To update UI and cellProp in DB
        setCellUIAndCellProp(evaluatedValue,inputFormula,address);
        addChildToParent(inputFormula);
        updateChldrenCells(address);
    }
})
function addChildToGraphComponent(formula,childAddress){
    let [crid,ccid]=decodeRIDCIDFromAddress(childAddress);
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let [prid,pcid]=decodeRIDCIDFromAddress(encodedFormula[i]);
            //B1: A1 + 10
            //rid -> i,cid -> j
            graphComponentMatrix[prid][pcid].push([crid,ccid]);
        }
    }

}
function removeChildFromGraphComponent(formula,childAddress){
    let [crid,ccid]=decodeRIDCIDFromAddress(childAddress);
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let [prid,pcid]=decodeRIDCIDFromAddress(encodedFormula[i]);
            //B1: A1 + 10
            //rid -> i,cid -> j
            graphComponentMatrix[prid][pcid].pop();
        }
    }
}
function addChildToParent(formula){
    let childAddress=addressBar.value;
    let encodedFormula=formula.split(" ");
    for(let i=0; i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let [parentCell,parentCellProp]=activecell(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
            
        }
    }
}
function removeChildFromParent(formula){
    
    let childAddress=addressBar.value;
    let encodedFormula=formula.split(" ");
    for(let i=0; i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue<=90){
            let [parentCell,parentCellProp]=activecell(encodedFormula[i]);
            let idx=parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx,1);
        }
    }
}

function updateChldrenCells(parentAddress){
    let [parentCell,parentCellProp] = activecell(parentAddress)
    let children = parentCellProp.children;
    for(let i=0;i<children.length;i++){
        let childAddress=children[i];
        let [childCell,childCellProp]=activecell(childAddress)
        let childFormula=childCellProp.formula
        let evaluatedValue=evaluateFormula(childFormula)
        setCellUIAndCellProp(evaluatedValue,childFormula,childAddress)
        updateChldrenCells(childAddress)
    }
}
function evaluateFormula(formula){
    
    let encodedFormula=formula.split(" ");
    
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            
            let [cell,cellProp]=activecell(encodedFormula[i]);
            encodedFormula[i]=cellProp.value;
            
        }
    }
    
    let decodedFormula=encodedFormula.join(" ");
    
    
    return eval(decodedFormula);
}            

   
    


function setCellUIAndCellProp(evaluatedValue,formula,address){
    
    let [cell,cellProp]=activecell(address);

    //UI update
    cell.innerText=evaluatedValue;
    //console.log(cell.innerText)
    //DB update
    cellProp.value=evaluatedValue;
    cellProp.formula=formula;
}