import React,{useState,useEffect} from 'react';
import './ViewAudience.css'
import {Button,Offcanvas,Form} from 'react-bootstrap';

import optionJSON from './options.json';
import { toast } from 'react-toastify';

function ViewAudience() {

    const [allOptions,setAllOptions] = useState(optionJSON);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [unselectedOptions, setUnSelectedOptions] = useState(allOptions);
    
    const [finalSelectedOptions, setFinalSelectedOptions] = useState([]);
    const [formData, setFormData] = useState({"segment_name":"","schema":[]});
    
    
    const [show, setShowCanvas] = useState(false);
    const CloseCanvas = () => setShowCanvas(false);
    const OpenCanvas = () => setShowCanvas(true);

    
    const changeHandler = (event) => {
      const {name,value} = event.target;
      
      setFormData((prevFormData) => {
        return{
          ...prevFormData,[name] : value
        }   
      })
    }

    useEffect(() => {    
        ConvertToFormat();   
    }, [selectedOptions])

    



    
    const ConvertToFormat = () => {
      console.log('trigger')
      let newFormattedArray = [];
      selectedOptions.forEach((item)=> 
        newFormattedArray.push({[item.value]:item.label})
      )
      setFinalSelectedOptions(newFormattedArray);

      setFormData({...formData,"schema":newFormattedArray})
  
    }

    const onChangeHandler = (event,index) => {
    
      let optionID = event.target.value;
      let optionData = allOptions.find((item)=> (optionID == item.id)  );

      let prevOption = selectedOptions[index];
      console.log(selectedOptions[index]);
      let newUnselectedOptions =  [...unselectedOptions,prevOption];
      
      setUnSelectedOptions([]);
      setUnSelectedOptions(newUnselectedOptions);


      selectedOptions[index] = optionData;
      console.log('se',selectedOptions)

      ConvertToFormat()
      
    }

    const schemaList = 
        selectedOptions.map((item,index) => {

          console.log(item.id,item.label,item.value);
          console.log("selectedOptions",selectedOptions);

          return(
            <div className='row mx-0 my-3'>
                <Form.Group className='coloredDotArea'>
                    <span className="green_dot"></span>
                </Form.Group>
                <Form.Group className='inputArea'>
                    <Form.Select aria-label="Default select example" defaultValue={item.id} onChange={(event)=>onChangeHandler(event,index)}>
                    <option value={item.id} >{item.label}</option>
                    {
                        unselectedOptions.map((option) => {
                          {if(!selectedOptions.includes(option)){
                            return(
                              <option value={option.id} >{option.label}</option>
                            )  
                            }                       
                          }
                       
                      })
                    }
                    </Form.Select>
                                
                </Form.Group>

                <Form.Group className='buttonArea'>
                    <Button className="btn-minus mx-2 border-0" onClick={()=>DeleteSchema(index,item.id)}><i className="fa fa-minus"></i></Button>
                </Form.Group>
            </div>
          )
          })
    
  
        
    

    const AddNewSchema = () => {
  
      let optionID = document.getElementById("NewSchemas").value;
      let optionData = allOptions.find((item)=> (optionID == item.id)  )
      
      console.log("optionData",optionData);
      if(optionID != 0){
          console.log(optionData.label,optionData.value);
          setSelectedOptions( prevState => [...prevState, optionData ] )

          
          let _unselectedOptions=unselectedOptions.filter((data)=> data.id !== optionData.id)
          console.log("_unselectedOptions",_unselectedOptions);
          setUnSelectedOptions(_unselectedOptions)

          document.getElementById("NewSchemas").value = "";
      }
      else{
        toast.error("Select an option to Add..!");
      }
    }

    const DeleteSchema = (index,id) => {
      
      
      let currentArray = [...selectedOptions];
      currentArray.splice(index, 1);

      setSelectedOptions(currentArray);
      console.log("currentArray",currentArray);

      let optionID = id;
      let optionData = allOptions.find((item)=> (optionID == item.id)  )
      let newUnselectedOptions =  [...unselectedOptions,optionData];
      setUnSelectedOptions(newUnselectedOptions)

    }

    const HandleSubmit = () => {

        console.log('formData.schema',formData.schema);
      

        if(formData.segment_name.length != 0 && formData.schema.length != 0 ){

          console.log("Save Segment [FormData]",formData);
          

          let requestOptions;
          requestOptions = {
              method: 'POST',
              mode: 'no-cors',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
          }
          fetch(`https://webhook.site/eea4fc26-cdc8-496b-b0dd-10746a700f31`, requestOptions)
            // .then(res => res.json())
            // .then(data => {
            //     console.log("data ==> ", data);
            //     return data;
            // }).catch(error => {
            //   console.log("error ==> ", error);
            //   return error;
            // });


             

          CloseCanvas();
          ResetAllInputs();
          toast.success("Segment Saved Successfully..!!!");

          setUnSelectedOptions(optionJSON);
        }
        else{
          toast.error("Fill all fields to proceed!");
        }



        

        


    }

    const ResetAllInputs = () => {
      setSelectedOptions([]);
      setUnSelectedOptions([]);
    }

  return (
    <div className='ViewAudience'>
        <div className='NavigationBar'>
          <h5><span className='icon_leftArrow'><i className="fa fa-sharp fa-solid fa-chevron-left"></i></span> View Audience</h5>
        </div>

        <main className='content'>
            <Button className='btn_SaveSegment' onClick={OpenCanvas}>
              Save Segment
            </Button>

            <Offcanvas className="SaveSegment" show={show} onHide={CloseCanvas} backdrop="static" placement="end">
                <div className='NavigationBar'>
                    <h5><span className='icon_leftArrow' onClick={CloseCanvas}><i className="fa fa-sharp fa-solid fa-chevron-left"></i></span> Saving Segment</h5>
                </div>
                
                <Offcanvas.Body>
                  
                  <Form>
                      <Form.Group className="mb-3" controlId="formBasicName">
                          <Form.Label>Enter the Name of the Segment</Form.Label>
                          <Form.Control type="text" placeholder="Name of the segment" name="segment_name" onChange={(event)=>changeHandler(event)} autoComplete="off"/>
                      </Form.Group>

                      <p>To save your segment, you need to add the schemas to build the query</p>
                      <div className='d-flex justify-content-end my-4'>
                          <p><span className="green_dot"></span><span> - User Traits</span></p> 
                          <p className='ms-3'><span className="red_dot"></span><span> - Group Traits</span></p>
                      </div>


                      {/*Listing All The Selected Schema Array*/}

                      <div className={selectedOptions.length > 0 ? "selectedSchemaList" : ""}>
                          {schemaList}
                      </div>


                      {/*Adding new Schema into Selected Schema Array*/}

                      <div className='addNewSchema'>
                          <div className='row mx-0 my-3'>
                              <Form.Group className='coloredDotArea'>
                                  <span className="grey_dot"></span>
                              </Form.Group>
                              <Form.Group className='inputArea'>
                                  <Form.Select aria-label="Default select example" id="NewSchemas">
                                  <option value="">Add schema to segment</option>

                                  {
                                    unselectedOptions.map((option) => {
                                      {if(!selectedOptions.includes(option)){
                                        return(
                                          <option value={option.id} >{option.label}</option>
                                        )}                       
                                      }}
                                    )
                                  }
                                  </Form.Select>
                                              
                              </Form.Group>

                              <Form.Group className='buttonArea'>
                                  <Button className="btn-minus border-0 mx-2"><i className="fa fa-minus"></i></Button>
                              </Form.Group>
                          </div>
                      </div>

                      <Button className="btn_addNewSchema" onClick={()=>AddNewSchema()}>+ <span>Add new schema</span></Button>

                  </Form>

                  <div className='button_panel'>
                      <Button className='btn_SaveSegment' onClick={()=>HandleSubmit()}>Save the Segment</Button>
                      <Button className='btn_Cancel'onClick={CloseCanvas}>Cancel</Button>
                  </div>

                </Offcanvas.Body>
            </Offcanvas>

        </main>
        
    </div>
  )
}

export default ViewAudience