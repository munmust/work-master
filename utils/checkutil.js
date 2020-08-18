/**
 * 验证value值为中文
 */
const checkC=(value)=> {
    let reg=/[\u4e00-\u9fa5]/;
    return reg.test(value);
}

/******************数字验证***************/
/**
 * 验证value值为数字
 */
const checkN=(value)=>{
    let reg=/[0-9]/;
    return reg.test(value);
}
/**
 * 验证value为整数
 */
const checkInteger=(value)=>{
    let reg=/^-?[1-9]d*$/
    return reg.test(value);
}
/**
 * 验证value为正整数
 */
const checkPInteger=(value)=>{
    let reg=/^[0-9]+$/;
    return reg.test(value);
}
/**
 * 验证value为负整数
 */
const checkNInteger=(value)=>{
    let reg=/^-[1-9]d*$/;
    return reg.test(value);
}
/**
 * 验证value为浮点数
 */
const checkFloat=(value)=>{
    let reg=/^-?([1-9]d*.d*|0.d*[1-9]d*|0?.0+|0)$/;
    return reg.test(value);
}
/**
 * 验证value为正浮点数
 */
const checkPFloat=(value)=>{
    let reg=/^[1-9]d*.d*|0.d*[1-9]d*$/;
    return reg.test(reg);
}
/**
 * 验证value为负浮点数
 */
const checkNFloat=(value)=>{
    let reg=/^-([1-9]d*.d*|0.d*[1-9]d*)$/;
    return reg.test(value);
}
/*******************************英文*******************************/
/**
 * 验证value值为英文
 */
const checkE=(value)=>{
    let reg=/[a-zA-Z]/;
    return reg.test(value);
}
/**
 * 验证value为大写字母
 */
const checkBE=(value)=>{
    let reg=/^[A-Z]+$/;
    return reg.test(reg);
}
/**
 * 验证value为小写字母
 */
const checkSE=(value)=>{
    let reg=/^[a-z]+$/;
    return reg.test(reg);
}
/*******************************组合*******************************/
/**
 * 验证value值为中文和英文
 */
const checkCE=(value)=>{
    let reg=/^[\u4e00-\u9fa5a-zA-Z]+$/;
    return reg.test(reg);
}
/**
 * 验证value值为英文和数字
 */
const checkEN=(value)=>{
    let reg=/^[a-zA-Z0-9]+$/;
    return reg.test(value);
}
/**
 * 验证value值为中文、英文和数字
 */
const checkCEN=(value)=>{
    let reg=/^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
    return reg.test(value);
}
module.exports = {
    checkC:checkC,
    checkE:checkE,
    checkN:checkN,
    checkInteger:checkInteger,
    checkPInteger:checkPInteger,
    checkNInteger:checkNInteger,
    checkFloat:checkFloat,
    checkPFloat:checkPFloat,
    checkNFloat:checkNFloat,
    checkBE:checkBE,
    checkSE:checkSE,
    checkCE:checkCE,
    checkEN:checkEN,
    checkCEN:checkCEN  
  }