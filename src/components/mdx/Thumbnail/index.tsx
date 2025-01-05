export const Thumbnail = (object : any) => {
    const src = object.src
    const tokens = src.split('/')
    const filename = tokens[tokens.length-1]
    return (
        <img
            src={`${src}`}
            style={{ 
                width: "100%" ,
                borderRadius :"8px"
            }}
            alt={`${filename}`}
        />
    )
}