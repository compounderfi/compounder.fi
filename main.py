import requests
import json

data = json.dumps("""{"query":"{\n  positions(where: {owner: \"0x365F45298Ae6039143C113Eb4ad89c7227818AAC\"}) {\n    id\n  }\n}","variables":null,"extensions":{"headers":null}}""")

res = requests.post("https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3", data=data)
print(res.status_code)
print(res.text)


fetch("", {
  "headers": {
    "accept": "application/json, multipart/mixed",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3/graphql?query=%7B%0A++positions%28where%3A+%7Bowner%3A+%220x365F45298Ae6039143C113Eb4ad89c7227818AAC%22%7D%29+%7B%0A++++id%0A++%7D%0A%7D",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"query\":\"{\\n  positions(where: {owner: \\\"0x365F45298Ae6039143C113Eb4ad89c7227818AAC\\\"}) {\\n    id\\n  }\\n}\",\"variables\":null,\"extensions\":{\"headers\":null}}",
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});