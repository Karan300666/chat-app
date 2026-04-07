import getAIResult from "../service/ai.service.js";

export async function AIResult(req , res){
     const { prompt } = req.query;
     if(!prompt){
        return res.status(400).json({message: "Prompt is require"})
     }

     const result = await getAIResult(prompt)
      return res.status(200).json({result})
}