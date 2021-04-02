const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "topic",
  description: "Get a random topic to speak about!",
  usage: "(Prefix)topic",
  execute(message, args) {
    const topics = [
      "What Is The Most Beautiful Song You Have Heard?",
      "What Song Gets You Pumped Every Time It Comes On?",
      "What’s Your Favorite Movie Or Show That Most People Haven’t Heard About?",
      "Who Is Your Celebrity Crush?",
      "What Song Do You Listen To The Most?",
      "If You Were Famous, What Industry Would You Like To Be Famous In?",
      "Which Of Your Friends Or Family Do You Look Up To Most?",
      "What Is Something You Got Away With As A Child That Your Family Still Doesn’t Know About?",
      "What Are The Most Common Reasons For Friendships To Fall Apart?",
      "What Is The Best Way To Meet New Friends?",
      "What Is The Most Annoying Type Of Friend?",
      "What Separates True Friends From Acquaintances?",
      "Do You Have Any Family Traditions? If So, What?",
      "What Do You Want To Be When You Grow Up?",
      "What’s A Hobby You’ve Always Wanted To Try?",
      "If You Could Eliminate One Thing From Your Daily Schedule, What Would It Be And Why?",
      "If You Had This Week To Do Over Again, What Would You Do Differently?",
      "If You Had A Uniform That You Had To Wear Every Day, What Would It Be?",
      "If You Could Go Anywhere In The Universe, Where Would You Go?",
      "What’s The Coolest Fact About The Universe You Know?",
      "What Are Some Fun Things You Could Do In Zero-G?",
      "Do You Still Consider Pluto To Be A Planet?",
      "Would You Ever Join A Mission To Colonize Another Planet If It Meant Never Returning To Earth?",
      "What’s The Most Interesting Place You’ve Visited?",
      "If You Could Live Anywhere In The World, Where Would You Choose?",
      "If You Could Go On A Trip Anywhere In The World With Anyone, Where Would You Go And Who Would You Take?",
      "When You Think Of “Home” What Do You Think Of?",
      "Hotel Or Tent?",
      "For Your Birthday, Would You Rather Go Somewhere Or Get Something?",
      "What Gift Have You Received That You Will Always Treasure?",
      "What One Possession Do You Cherish The Most?",
      "What Is The One Thing You Would Really Like To Own?",
      "What Is The Most Creative Gift You’ve Ever Made? Received?",
      "What Is The Craziest Thing You’ve Ever Done?",
      "How Often Do You Push Yourself Outside Of Your Comfort Zone?",
      "Have You Ever Overheard A Conversation You Weren’t Supposed To? What Was It About?",
      "Have You Ever Walked In On Something You Weren’t Supposed To? What Happened?",
      "Have You Ever Had To Hold Your Tongue Even Though You Really Wanted To Say What Was On Your Mind?",
      "Have you ever been talking about someone and they walk up?",
      "What Is Your Most Awkward Moment From Middle School Or High School?",
      "If You Could Add Any Word To The Dictionary, What Word Would It Be, And What Would It Mean?",
      "What Is The Most Unusual Thing In Your Wallet, Pocket, Or Purse Right At This Moment?",
      "If All Your Furniture Sprang To Life, Beauty And The Beast Style, Which Piece Would Scare You Most?",
      "If Your Best Friend Wrote A Book About You, What Would The Title Be? What About Your Worst Enemy?",
      "If You Had To Be Named After A City, State, Or Country (Etc), Which Would You Want It To Be?",
      "If You Were A Candy Bar, Which Candy Bar Would You Be?",
      "What Is A Challenge You Would Never Want To Face?",
      "What Real-Life Situation Where You Stood Up For Someone/Something?",
      "What was the first car you owned?",
      "What were your favorite holidays when you were a child?",
      "Do you like coffee?",
      "Do you take a lot of pictures?",
      "Do you think alien life exists?",
      "Do you think we’ll find microscopic alien life in our own solar system?",
      "Do you think a lot of change is healthy or unhealthy for a person?",
      "What do you think has been the biggest change that has happened in the last 50 years?",
      "What was your most epic cooking failure?",
      "Is there anything you are naturally good at?",
      "What do you like / hate shopping for?",
      "What are some things you want to achieve before you die?",
      "What is a fashion trend you are really glad went away?",
      "Do you play any musical instruments?",
      "What is your guilty pleasure?",
      "What word or saying from the past do you think should come back?",
      "What is the strangest dream you have ever had?",
      "If you had intro music, what song would it be? Why?",
      "What was the best invention of the last 50 years?",
      "Where is the most awe inspiring place you have been?",
      "Can you describe your life with a six word sentence?",
      "Is happiness an end goal or simply a by-product of other things?",
      "Could we ever accurately predict the future? Or does the “spooky action” of the quantum world, as Einstein put it, mean things are inherently unpredictable?",
      "Is love dependence on another?",
      "What local events are you looking forward to?",
      "Do you like spending time alone or with friends?",
      "What do you do/study?",
      "What is your dream job?",
      "What was your biggest experience of “culture shock” in another country",
      "What’s the worst thing that’s happened to you while traveling?",
      "What’s your favorite movie (or TV show) ever?",
      "What is your guilty pleasure?",
      "What word or saying from the past do you think should come back?",
      "What do you bring with you everywhere you go?",
      "What is the most annoying habit someone can have?",
      "What is the strangest dream you have ever had?",
      "If you had intro music, what song would it be? Why?",
      "Can you describe your life with a six word sentence?",
      "Is happiness an end goal or simply a by-product of other things?",
      "Is love dependence on another?",
      "Do you speak any other languages?",
      "Do you think there ever will be a Third World War?",
      "Does anyone believe in ghosts?",
      "What smell brings back great memories?",
      "What is the best way to stay motivated and complete goals?",
      "Do opposites really attract?",
      "Why is beauty so subjective?",
      "Nature of nurture – which plays the biggest role in who you are?",
      "Why do we remember some things vividly and forget other things entirely?",
      "What is your most vivid memory from your early childhood?",
      "Which of your parents are you most like in terms of personality?",
      "What are you most afraid of? Why?",
      "What are your 3 biggest character flaws?",
      "What are you most proud of? Why?",
      "What percentage of your decisions do you think are made by your unconscious or subconscious and what percentage by your conscious?",
      "Are you more YOU when you are alone or when you are with others?",
      "How old do you feel in your mind?",
      "Are you an optimist or a pessimist? What are your reasons for being so?",
      "Are you the same person you were yesterday?",
      "What is time? Are we affected by it, or does our consciousness create it?",
      "Could we ever accurately predict the future? Or does the “spooky action” of the quantum world, as Einstein put it, mean things are inherently unpredictable?",
      "Are there an infinite number of realities beyond our own where each possible decision is taken and each fork in the road traveled down?",
      "Why is there something and not nothing?",
      "Why do you believe what you believe to be true?",
      "Do you believe that man is inherently good?",
      "Do you believe intelligent life exists beyond this planet?",
      "Have you ever changed your mind and stop believing something that you once strongly believed in? Why?",
      "Why is it so easy to overlook the mass suffering in the world?",
      "Should we have the right to end our own lives?",
      "If it were guaranteed to reduce violent crime by 30%, should everyone have to give a DNA sample to the police? What if it were 80%?",
      "Is it ok to perform experiments on animals if it means saving human lives? Does the type of animal matter?",
      "What was the highlight of your day today?",
      "What was the highlight of your week?",
      "What are you doing this weekend?",
      "Can you recommend any unique cocktails / appetizers / desserts?",
      "What is your ideal first date?",
      "Where did you go on your first date?",
      "Share embarrassing memories from elementary, middle or high school that have stuck with you.",
      "Talk about your high school crushes and where they are now in life.",
      "What restaurants are on your food bucket list?",
      "What are your secret nicknames?",
      "How are you taking care of yourself during this time?",
      "If you could work remotely forever, would you still live where you live?",
      "Do you prefer cold weather or hot weather?",
      "Talk about a significant event that caused a positive change in you as a person.",
      "Talk about your future; how you picture your life in five years and in ten.",
      "Who is your hero and what qualities make them your choice?",
      "Tell about a time when someone showed you kindness or compassion. Tell about a time when you showed compassion or kindness to someone else.",
      "If you won the lottery, what is the first thing you would buy? Why?",
      "Find similarities and differences. Discuss them.",
      "What makes you excited? What was the last exciting experience you had?",
      "What is your favorite item of clothing and why is it your favorite?",
      "What values are important in your life? Were they imparted to you by your parents? If not, from where did they come?",
      "When and where do you feel most like your real self? Why?",
      "What characteristics do you think are necessary for a strong relationship? Do you possess these characteristics?",
      "Share a secret about yourself.",
      "What would you do on a “perfect” day? Would you want to do something with someone else or be alone?",
      "What is one thing that scares you the most? Why?",
      "If you could be any character in a book or movie, who would you be? Why?",
      "Describe your biggest regret?",
      "What did you dream of being when you were a child? Have you managed to achieve any of your dreams?",
      "What is your dream job and do you believe you will ever succeed at having it?",
      "How many siblings do you have and are they older or younger? How is your relationship with them?",
      "Tell about a time when someone hurt or betrayed you and how the experience has affected your adult life.",
      "Tell about your most difficult challenge thus far in your life. Were you able to overcome and what did you learn?",
      "Where’s your life headed?",
      "Are humans better at creation or destruction?",
      "What are the best and worst parts of human nature?",
      "Is human nature constant or is it molded by culture? Can human nature be completely changed by culture or society?",
      "If pressing a button meant you received 5 million dollars but it also killed 5 people somewhere in the world, would you press it? What if it killed only 1 person or killed 20 people? What if the people were people you knew?",
      "What is a miracle that happens every day?",
      "What is the purpose of art in society?",
      "How important are morals in a healthy society? What are the most important morals for citizens to have?",
      "What one thing you want to do before you die?",
      "What is the most unbearable and unforgivable thing for you?"
    ];

    const topic = topics[Math.floor(Math.random() * topics.length)];
    const topicemb = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "http://cdn.tritan.gg/tritan-bot/icon.webp")
      .setColor(message.client.config.colors.EMBED_COLOR)
      .addField("Let's talk about...", topic)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.colors.EMBED_COLOR);
    message.channel.send(topicemb);
  }
};
