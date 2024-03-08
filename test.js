import auth from "./azure/auth.js";

import { decrypt, directoryContact, masterContact } from "./utils.js";
import dotenv from 'dotenv';
import refresh from "./masterSync/refresh.js";
dotenv.config();

export default async function test() {
  const client = await auth();



  // const datakey = "GrcWSKUUEUwmBce5NlQa/4LZkXiMcxiYRFXRidHiPSX2kkjGQ1H85KKN355TxnMCP6QY9exkF1HqJ2oGimH9x4ZxfkZ5MfyZdT8kKBG8/13mBPYDDq5Qtl5sKsRMMsDZq3GlAyYLTfiZf7K7yh6m3A0eK17YcxhHgr3PcxY8YExAmTNbbEff780fk49/xmOb+2P9D3z/bdLHhLGRn+7jV2nyWLPRHsQjRPZ80Ukvt/kZePMl2jE337Sr2hiOQ3k1i+VNIgX9EcRbE/BxkGgM5uKqDjRO7GxL6a2HuXBf1KV0R0jXkWYS7mTQyJtw70ZBR/XlVvtReDNI35xgFdTIhQ=="

  // const data = "rSX67Q83wcpYSQrF+bVgP76VQu5n7hn+CLpBAyHJ4SvZMgqX6ZIuFx5biQvxXvmiWugQs3yzdn5yUTnUUa9AnFuwDOW+S2PB2PqsN47s4JXrG+H89yupitgd7XPb1D31hFthBFjwIyJosYyZLwwUNFuXuEwAE2i/DogwVTUohnE0xfG4I8Loaz7QMb+HpVgWidV/bKCKr2KeEDPtoJCkbXipPWYS4FwcrriHJikdBouq87WI4iYwVk4FbKhbUgF/2XTbntekiyMA+TwKB1h+UuZpDGscJuNXeGM0JK7KUnivEBMBgEQ9fTuTobvPue+f5F9djmeWph0ibt8ERrr/9Z8kg3O5foiMYAVJSbBROKUi2bxcghVqi/67liYtDWNVD047e32bhBs4UCuJxbg41599Us4sKX/TO8UR+RcydZ3aq+xszILOeI4FCuUIM+1motZxTEJx98uB4/e5Xlk6wNcm+r7n2ZWXwfy4wwxXy/GiTu5sEqG818PM+JPz5UdrSpbMdwv9g23gw+hl54Rcnw=="

  // const msg = decrypt(process.env.AZURE_PRIVATE_KEY, datakey, data)
  // console.log(msg);

  const id = "AAMkADkyYzcwNmNiLWFiMDAtNDg1OC05NTkwLTUwMjBmOTk1NGJjMwBGAAAAAACnxXzxFZ7YS5DJ7xpznyfgBwB3gke_SN33QInYpZ0MWwuWAAAAABEYAAB3gke_SN33QInYpZ0MWwuWAAAAAZdNAAA=";

  const SirMasterTestingDir = await directoryContact(client, "AAMkADkyYzcwNmNiLWFiMDAtNDg1OC05NTkwLTUwMjBmOTk1NGJjMwBGAAAAAACnxXzxFZ7YS5DJ7xpznyfgBwB3gke_SN33QInYpZ0MWwuWAAAAABEYAAB3gke_SN33QInYpZ0MWwuWAAAAAZdNAAA=")

  const res = await client.api(`${process.env.DIRECTORY_PATH}/${id}`).patch({ spouseName: "test" });

  console.log(res);
}
test();




