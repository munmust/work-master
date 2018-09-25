Component({
  options: {
    multipleSlots: true
  },
  properties: {
    img: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: '标题'
    }, 
    subtitle: {
      type: String,
      value: '小标题'
    }
  }
})