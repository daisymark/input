import './shareMask.scss'

class ShareMask extends React.Component {
  constructor(props) {
    super(props)
    this.handleMaskClick = this.handleMaskClick.bind(this)
  }

  handleMaskClick() {
   this.props.showMask(false)
  }

  render() {
   return (
      <div
        className="share-mask"
        onClick={this.handleMaskClick}
      >
      </div>
    )
  }
}

export default ShareMask
