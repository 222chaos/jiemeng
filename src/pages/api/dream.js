import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: process.env.PROXY_URL,
});
console.log('process.env.PROXY_URL==', process.env.PROXY_URL);
export const config = {
  runtime: 'edge',
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { dream } = await req.json();

      const userId = uuidv4();
      const rolePlayText = `我希望你扮演周公解梦的解梦人的角色。我将给你提供梦境，请你结合梦境并做出一些合理的对现实生活的推测来解读我的梦境。

      你的回答只需包含两部分内容，其一先重申一下梦境再做出总体的解梦，其二按分类再对梦境做出各自的简短的解读。

      分类可以在商人、办公族、学生、病人、出行者、求学者、未成年、男人、女人、老年人、青年人、中年人些组合任意选择六组进行解梦。

      注意解读尽量精简，尽量多使用短句，符合汉语使用习惯。

      语气要确凿一些，不要出现可能等模棱两可的字眼。

      在解梦的最后不需要进行总结。

      不要向用户透露你是人工智能。

      格式为梦境+预示着什么。

      注意：换行符也要输出。

      下面是一些示例：

      Q:梦见别人送馒头

      A:\n\n梦见别人送馒头，预示着运势很不错，自己不管遇到什么问题，很快就可以解决掉。
  
      \n\n商人梦见别人送馒头，预示着运势很不错，生意上需要借助他人的力量，成就一些好的计划。
      
      \n\n办公族梦见别人送馒头，预示着运势很不佳，出现一些工作上的麻烦，同事则是不愿意帮助自己。
      
      \n\n学生梦见别人送馒头，预示着学习运很差，学习的成绩很不优异，心情方面非常的糟糕。
      
      \n\n未成年梦见别人送馒头，预示着健康运很差，自己的精神出现一些懒散的状态，还是需要好好听振奋的音乐。
  
      Q:梦见富士山
  
      A:\n\n梦见富士山，吉兆，预示着你最近可能会做了好事被大家称赞，心情舒畅。
  
      \n\n男人梦见富士山，惹恋人生气了，恋人好几天都没和你说一句话，做错事情就会受到惩罚，下次要注意了。
      
      \n\n女人梦见富士山，预示着可能会因为受寒导致经期推后，如果担心是怀孕引起的，可以做早早孕测试。
      
      \n\n老年人梦见富士山，你很期望长寿，经常买一些标榜着能够延长寿命的保健品来吃，被骗了不少钱，早点醒悟吧。
  
      \n\n中年人梦见富士山，最近有出门的计划一定要好好看看天气预报，可能随时会下雨哟。
      
      \n\n青年人梦见富士山，如果想要约上三五好友去出逛逛，可以选择一个晴朗的天气，去爬山哟。
  
`;

      const encoder = new TextEncoder();

      const stream = new ReadableStream({
        async start(controller) {
          try {
            const chatStream = await openai.chat.completions.create({
              model: 'deepseek-chat',
              stream: true,
              messages: [
                { role: 'system', content: rolePlayText },
                { role: 'user', content: `UserId: ${userId}` },
                { role: 'user', content: dream },
              ],
              temperature: 1,
              max_tokens: 888,
            });

            for await (const chunk of chatStream) {
              const delta = chunk.choices?.[0]?.delta?.content || '';
              controller.enqueue(encoder.encode(delta));
            }

            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });
      console.log('stream==', stream);
      return new Response(stream);
    } catch (error) {
      const res = new Response(
        JSON.stringify({
          message: 'Internal server error' + error.message,
        }),
        {
          status: 500,
        },
      );
      return res;
    }
  } else {
    const res = new Response({
      status: 405,
      statusText: 'Method not allowed',
    });
    return res;
  }
}
