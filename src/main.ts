interface DeviceInt{
    id:string;
    name:string;
    description:string;
    state:string;
    type:number;
}


class ViewMainPage
{
    myf:MyFramework;

    constructor(myf:MyFramework)
    {
        this.myf = myf;    
    }




    showDevices(list:DeviceInt[]):void
    {
        // cargo la lista de objetos en el DOM
        let devicesUl:HTMLElement = this.myf.getElementById("devicesList");

        let items:string="";
        for(let i in list)
        {   
            let checkedStr="";
            if(list[i].state=="1")
                checkedStr="checked";

            switch(list[i].type)
            {
                case 0: // Lampara                     
                    items+="<li class='collection-item avatar'> \
                                <img src='images/lightbulb.png' alt='' class='circle'> \
                                <span class='title'>"+list[i].name+"</span> \
                                <p>"+list[i].description+"<br> \
                                </p> \
                                <a href='#!' class='secondary-content'> <div class='switch'> \
                                                                            <label> \
                                                                            Off \
                                                                            <input type='checkbox' id='dev_"+list[i].id+"' "+checkedStr+"> \
                                                                            <span class='lever'></span> \
                                                                            On \
                                                                            </label> \
                                                                        </div></a> \
                            </li>";  
                    break;  
                case 1: // Persiana                    
                    items+="<li class='collection-item avatar'> \
                                <img src='images/window.png' alt='' class='circle'> \
                                <span class='title'>"+list[i].name+"</span> \
                                <p>"+list[i].description+"<br> \
                                </p> \
                                <a href='#!' class='secondary-content'> <div class='switch'> \
                                                                            <label> \
                                                                            Off \
                                                                            <input type='checkbox' id='dev_"+list[i].id+"' "+checkedStr+"> \
                                                                            <span class='lever'></span> \
                                                                            On \
                                                                            </label> \
                                                                        </div></a> \
                            </li>";  
                    break;                                                    
            }
        }

        devicesUl.innerHTML=items;
    }

    getSwitchStateById(id:string):boolean {
        let el:HTMLInputElement = <HTMLInputElement>this.myf.getElementById(id);       
        return el.checked;
    }
}

class Main implements GETResponseListener, EventListenerObject, POSTResponseListener
{ 
    myf:MyFramework;
    view:ViewMainPage;

    handleEvent(evt:Event):void
    {
        let element: HTMLElement = this.myf.getElementByEvent(evt);
        console.log(`click en elemento: ${element.id}`);
        switch (element.id) {
            case "boton-todos":
                this.myf.requestGET("ws/devices?filter=0",this);
                break;
            case "boton-lamparas":
                this.myf.requestGET("ws/devices?filter=1",this);
                break;
            case "boton-persianas":
                this.myf.requestGET("ws/devices?filter=2",this);
                break;
            default:
                let data:object = 
                    {"id":element.id,
                    "state":this.view.getSwitchStateById(element.id)};
                this.myf.requestPOST("devices",data,this);
        }
    }

    handleGETResponse(status:number,response:string):void{
      if(status==200)
      {
          console.log(response);
          let data:DeviceInt[] = JSON.parse(response);
          console.log(data);
          this.view.showDevices(data);    
          
          for(let i in data)
          {
              //let sw:HTMLElement = this.myf.getElementById("dev_"+data[i].id);
              //sw.addEventListener("click",this);    
              this.myf.configClick(`dev_${data[i].id}`,this);               
          }
      }
    }

    handlePOSTResponse(status:number,response:string):void{
        if(status==200)
        {
            console.log(response);
        }
    }

    main():void 
    { 
      this.myf = new MyFramework();

      this.view = new ViewMainPage(this.myf);

      this.myf.requestGET("devices",this);

      this.myf.configClick("boton-todos",this);
      this.myf.configClick("boton-lamparas",this);
      this.myf.configClick("boton-persianas",this);

    } 
} 
 
window.onload = () => {
    let obj = new Main(); 
    obj.main();
};
 

