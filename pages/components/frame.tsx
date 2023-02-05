
export default function Frame() {
  let squirsx: any[] = [];
  let squirsy: any[] = [];

  // codinates x
  for (let i = 0; i < 50; i++) {
    if (i == 5) {
      squirsx.push(<div className="cordx check"></div>)
    } else {
      squirsx.push(<div className="cordx"></div>)
    }
  }
  for (let i = 0; i < 50; i++) {
    squirsy.push(<div className="cordy">{squirsx}</div>)
  }
  return (
  <>
    <div id="container">
    {squirsy}
    </div>
  </>
  )
}
