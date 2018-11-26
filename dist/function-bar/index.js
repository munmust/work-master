Component({
  externalClasses: ['extra-class'],
  properties: {
    title: String,
    subtitle: String,
    color: String,
    imgSrc: String
  },
  data: {
  },
  methods: {
    onTap: function () {
      this.triggerEvent('mytap', {});
    }
  }
})