# Web3

> An awesome Web3 demo.

```jsx
/*react*/
/*no-boot-code*/
import Web3 from 'web3';
const web3 = new Web3(window.web3.currentProvider);
var info = web3.eth.getBlock(3150);

async function displayBlockInfo() {
  console.log(await web3.eth.getBlock(350));
}

<desc>
Test Web3 object
</desc>
<script>
  let globalVariable = 'Aaron Drake'
  export default class Application extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        color: 'blue'
      }
      this.globalVariable = globalVariable
    }
    render() {
      return (
        <div>
          <div className='wrapper' ref={el => this.el = el}>
            <div>
            Block number: <input id="blockNumber" />
            <button style={{color: this.state.color}} className='test' onClick="displayBlockInfo();">Test</button>
            </div>
          </div>
        </div>
      )
    }
  }
</script>
```
