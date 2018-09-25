Component({

  options: {
    multipleSlots: true
  },

  properties: {
    name: {
      type: String,
      value: '标签名'
    },
    placeholder:{
      type: String,
      value:'输入提示'
    },
    bindChange:{
      type: null
    },
    array:{
      type:Object,
      value:['无']
    },
    index:{
      type:Number,
      value:0
    }
  }
  
});
