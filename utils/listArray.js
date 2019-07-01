function getSData() {
  var data = [{
    title: '新建活动',
    subtitle: '校园活动/社会实践/志愿活动/组织履历/义工',
    imgSrc: '../../images/holdact.png',
    type: 'make'
  },
    {
      title: '管理活动',
      subtitle: '管理活动/分派扫码员',
      imgSrc: '../../images/undone.png',
      type: 'manage'
    },
    {
      title: '党建活动管理',
      subtitle: '管理党建活动',
      imgSrc: '../../images/undone.png',
      type: 'party'
    },
    {
      title: '义工活动管理',
      subtitle: '管理义工活动',
      imgSrc: '../../images/undone.png',
      type: 'volunteerWork'
    },
    {
      title: '志愿活动管理',
      subtitle: '管理志愿活动',
      imgSrc: '../../images/undone.png',
      type: 'volunteerActivity'
    },
    {
      title: '社会实践管理',
      subtitle: '管理社会实践',
      imgSrc: '../../images/undone.png',
      type: 'practice'
    }];
  return data;
}

function getActivityType() {
  var data = [
    '校园活动',
    '志愿活动',
    '实践活动',
    '讲座活动'
  ];
  return data;
}

module.exports = {
  getSData: getSData,
  getActivityType: getActivityType
}