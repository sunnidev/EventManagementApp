const Logger = {
    info:(message:string,data?:any) => {
        console.log(`[Info] ${message}`,data || "")
    },
    error:(message:string,data?:any) => {
        console.log(`[ERROR] ${message}`,data || "")
    },
   
}

export default Logger