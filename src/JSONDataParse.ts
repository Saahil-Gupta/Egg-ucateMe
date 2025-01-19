import { useEffect, useState } from "react";


    type DataPushType = {
    message : String;
    transcription : String;
    key_takeaways : [String];
    flashcards : {String: String};
    summary : String;
    transcript_id : String;
}
function useGetData(prop: File){

    const [dataReceived, setDataRecieved] = useState(false);

    useEffect (() =>{
        async function handleJSONRequest(){
            const [dataText, setDataText]:any = useState('')
        }
    });
    var JSONData: any = '';
    if (prop){
         setDataRecieved(dataReceived && false)
      const formData = new FormData();
            formData.append('file', prop);  // Append the file only
            
            try{
      fetch('http://127.0.0.1:5000/audio_video', {
              method: 'POST',
              body: formData,
            }).then(function(result){
                JSONData = () => {return result.json || ""}
            });
          } catch(e){
            console.log("ERROR! ${e}");
          }finally{
            setDataRecieved(true);
          }
        }
        
        
        
    return 
    }


    


export default useGetData;
export {useGetData}