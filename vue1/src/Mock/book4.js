const Mock = require('mockjs');
export default [{
    url: "/books/4",
    type: "get",
    response: () => {
        return {
            code: 2000,
            data: {
                id: 4,
                img: require("./../assets/images/4.png"),
                items:[
                    {text:"第一组"},
                    {text:"第二组"},
                    {text:"第三组"},
                ],
                title: 'Spring Boot实战',
                introduction: '本书从源码层面分析了Node.js。首先，简要介绍了Node.js；然后详细讲解了其内部核心技术“变化侦测”，这里带领大家从0到1实现一个简单的“变化侦测”系统；接着详细介绍了虚拟DOM技术，其中包括虚拟DOM的原理及其patching算法；紧接着详细讨论了模板编译技术，其中包括模板解析器的实现原理、优化器的原理以及代码生成器的原理；最后详细介绍了其整体架构以及提供给我们使用的各种API的内部原理，同时还介绍了生命周期、错误处理、指令系统与模板过滤器等功能的原理。',
                author: 'Bill Gates',
                press: 'MS Press',
                ISBN: '1352211231237',
                href:'http://product.dangdang.com/26922892.html',
                comments:[{
                    username:'Win XP',
                    says: '以太坊yyds'
                },
                    {
                        username: 'Win7',
                        says: '通过投资加密货币，你可以成为新韭菜'
                    },
                    {
                        username: 'Win 10',
                        says: '上面各位都是垃圾'
                    }]
        }
    }}
}]
