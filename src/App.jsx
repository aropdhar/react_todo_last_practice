import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDatabase, ref, set , push , onValue , remove , update} from "firebase/database";

function App() {
  
  const db = getDatabase();

  let [text , setText] = useState("");
  let [arr , setArr] = useState([]);
  let [show , setShow] = useState(true)
  let [info , setInfo] = useState(' ')

  let handleinput = (e) =>{
    
    setText(e.target.value);

  }
  
  let handlebtn = () =>{

    set(push(ref(db, 'todolastpractice')), {
      MyText: text
    }).then(()=>{
      toast('Data Write Succesfully!!!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });

    })
  }

  useEffect(()=>{
    
    const todocountref = ref(db, 'todolastpractice');
    onValue(todocountref, (snapshot) => {
      
      let arr1 = [];

      snapshot.forEach((item)=>{

        arr1.push({...item.val() , id: item.key })
        
      });

      setArr(arr1);
      
    });

  },[]);

  let handledelete = (deleteid) =>{

    remove(ref(db, 'todolastpractice/' + deleteid ));

  }

  let handleEdit = (editinfo) =>{
    
    setText(editinfo.MyText);
    setShow(false);
    setInfo(editinfo);
  }

  let handleupdate = () =>{

    update(ref(db, 'todolastpractice/' + info.id),{
      MyText: text
    }).then(()=>{ 
      setShow(true);
    });

  }

  return (
    <>
       <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"        
      />

      <div className="todo_main">
        <input onChange={handleinput} type="text" value={text} placeholder="Enter Your Content"/>
        {show ?

        <button onClick={handlebtn}>Add Todo</button>
        :
         
        <button onClick={handleupdate}>Update</button>

        }
      </div>
      
     <div className="read_main">
        <ul>
          {arr.map((item , index)=>(
            <li key={index} className="list_main">{item.MyText}
              <div className="btn">
              <button onClick={()=>handledelete(item.id)}>Delete</button>
                <button onClick={()=>handleEdit(item)}>Edit</button>
              </div>
            </li>

          ))

          }
        </ul>
     </div> 

    </>
  )
}

export default App
