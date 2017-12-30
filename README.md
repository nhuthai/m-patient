# m-patient

OxfordHack hackathon project
https://oxfordhack2017.hackerearth.com/sprints/oxfordhack-2017/dashboard/1e65c2e/submission/

![alt text](https://he-s3.s3.amazonaws.com/media/sprint/oxfordhack-2017/team/306760/9f79416screen_shot_2017_11_26_at_10_42_55_am.png)

![alt text](https://he-s3.s3.amazonaws.com/media/sprint/oxfordhack-2017/team/306760/bf39b11screen_shot_2017_11_26_at_10_43_46_am.png)

![alt text](https://he-s3.s3.amazonaws.com/media/sprint/oxfordhack-2017/team/306760/6c588fascreen_shot_2017_11_26_at_11_59_57_am.png)

## Motivation

The aim of the project is to foster empathy between patients. According to recent research, patients usually feel isolated and lonely as they are embarrassed to talk about their feelings and struggles. This is also inspired by a story of our teammate whose father passed away of cancer a few years back. He also went through different stages of emotion. Obviously they need an air of compassion within the community.

## Project description

We built a Facebook Messenger Chatbot where it can offer companion recommendations based on a patient's disease and psychology. We also tried out an 'anonymous' chat feature where the chatbot servers as a middleman between two patients. If the mood of patient is improved post-chatting, Chatbot would recommend this peer to patient to establish long-term relationship. Further, the chatbot can also recommend news and articles related to the patient's health.

We used Wit.ai as a tool for Natural Language Processing and Random Forest to predict psychological state of a patient and use it to match patients. We also built a dedicated backend server in NodeJS and hosted it on Heroku. For news recommendation, we used Microsoft's Bing News Search API which is a part of their Cognitive Services suite.

## Instructions to run

These environment variables must be set in production environment (for example, Heroku):
1. process.env.VERIFY_TOKEN
2. process.env.PAGE_ACCESS_TOKEN
3. process.env.MICROSOFT_KEY
4. process.env.MONGODB_URI
