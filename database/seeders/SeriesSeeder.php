<?php

namespace Database\Seeders;

use App\Models\Series;
use App\Models\Week;
use Illuminate\Database\Seeder;

class SeriesSeeder extends Seeder
{
    public function run(): void
    {
        $series = Series::create([
            'title' => 'Together by Design',
            'subtitle' => "God's Blueprint for Biblical Community",
            'badge_text' => '6-Week Bible Study',
            'description' => 'A comprehensive study exploring what the Bible teaches about authentic Christian community.',
            'key_verse' => 'Behold, how good and pleasant it is when brothers dwell together in unity!',
            'key_verse_ref' => 'Psalm 133:1 (ESV)',
            'slug' => 'together-by-design',
            'icon' => '🤝',
            'is_published' => true,
        ]);

        $this->createWeeks($series);
    }

    private function createWeeks(Series $series): void
    {
        $weeksData = $this->getWeeksData();

        foreach ($weeksData as $weekNumber => $data) {
            Week::create([
                'series_id' => $series->id,
                'week_number' => $weekNumber,
                'title' => $data['title'],
                'question' => $data['question'],
                'icon' => $data['icon'] ?? '📖',
                'recap' => $data['recap'] ?? null,
                'next_week_title' => $data['nextWeek']['title'] ?? null,
                'next_week_homework' => $data['nextWeek']['homework'] ?? null,
                'sections' => $data['sections'],
            ]);
        }
    }

    private function getWeeksData(): array
    {
        return [
            1 => [
                'title' => 'Why We Gather',
                'question' => 'Why are we here, and what do we expect from life together?',
                'icon' => '🤔',
                'recap' => null,
                'nextWeek' => [
                    'title' => 'Called to Community',
                    'homework' => 'Read Genesis 1-2 and John 17. Note every instance where God demonstrates relationship and community. Also read Luke 6:12-16 and Mark 5:37—notice how Jesus chose and prioritized relationships.',
                ],
                'sections' => [
                    [
                        'title' => 'Opening Reflection',
                        'icon' => '💭',
                        'content' => [
                            ['type' => 'body', 'text' => "Before we dive into Scripture, let's honestly examine why we're here and what we hope to find. The answers matter because they shape how we engage with one another."],
                            ['type' => 'body', 'text' => "By being here tonight, you've already made a choice. You're choosing to invest in THIS group, THESE people. That choice matters more than you might realize—because your capacity for deep community is limited. You are not God. You cannot go deep with everyone. So why here? Why us?"],
                            ['type' => 'prompts', 'questions' => [
                                'Why did you join this small group? What were you looking for?',
                                'What expectations do you have—for others in this group? For yourself?',
                                'How would you describe your role in community? (Listener? Encourager? Teacher? Learner?)',
                                'Has any community ever truly met your expectations? What made it work or fail?',
                            ]],
                            ['type' => 'leaderNote', 'text' => 'Give 2-3 minutes of silence before sharing. This sets a reflective tone for the whole series.'],
                        ],
                    ],
                    [
                        'title' => "God's Design for Gathering",
                        'icon' => '📖',
                        'content' => [
                            ['type' => 'body', 'text' => "Scripture reveals that community isn't an afterthought—it's central to God's design for humanity from the very beginning."],
                            ['type' => 'scripture', 'ref' => 'Genesis 2:18', 'text' => 'Then the LORD God said, <span class="highlight">"It is not good that the man should be alone;"</span> I will make him a helper fit for him.'],
                            ['type' => 'prompts', 'questions' => [
                                "This is the FIRST time God says something is 'not good' in creation. Why do you think aloneness was addressed before sin even entered the world?",
                                'If Adam needed another person in a perfect, sinless world, what does that tell us about our need for community?',
                            ]],
                            ['type' => 'leaderNote', 'text' => "Key insight: Community isn't just for broken people needing support—it's for ALL people by design. Even perfection included relationship."],
                            ['type' => 'scripture', 'ref' => 'Ecclesiastes 4:9-12', 'text' => '<span class="highlight">Two are better than one,</span> because they have a good reward for their toil. For if they fall, <span class="highlight">one will lift up his fellow.</span> But woe to him who is alone when he falls and has not another to lift him up! Again, if two lie together, they keep warm, but how can one keep warm alone? And though a man might prevail against one who is alone, <span class="highlight">two will withstand him—a threefold cord is not quickly broken.</span>'],
                            ['type' => 'prompts', 'questions' => [
                                'Solomon lists four benefits of companionship. Can you identify them?',
                                "When was the last time someone 'lifted you up' when you fell? What did that look like?",
                                "What or who is the 'third cord' that makes community unbreakable?",
                            ]],
                            ['type' => 'leaderNote', 'text' => "Four benefits: 1) Better reward for work, 2) Help when fallen, 3) Warmth/comfort, 4) Protection. The third cord is often interpreted as God Himself woven into our relationships."],
                        ],
                    ],
                    [
                        'title' => 'Expectations vs. Reality',
                        'icon' => '⚖️',
                        'content' => [
                            ['type' => 'scripture', 'ref' => 'Romans 12:9-13', 'text' => '<span class="highlight">Let love be genuine.</span> Abhor what is evil; hold fast to what is good. <span class="highlight">Love one another with brotherly affection. Outdo one another in showing honor.</span> Do not be slothful in zeal, be fervent in spirit, serve the Lord. Rejoice in hope, be patient in tribulation, be constant in prayer. <span class="highlight">Contribute to the needs of the saints</span> and seek to show hospitality.'],
                            ['type' => 'prompts', 'questions' => [
                                'Paul paints a picture of Christian community. Which characteristic do you most LONG for?',
                                'Which one challenges you most to GIVE?',
                                "'Outdo one another in showing honor'—what would that competition look like in our group?",
                            ]],
                            ['type' => 'leaderNote', 'text' => 'Help the group see that healthy expectations align with Scripture. We should expect genuine love AND expect to GIVE genuine love.'],
                            ['type' => 'scripture', 'ref' => 'Hebrews 10:24-25', 'text' => 'And let us consider how to <span class="highlight">stir up one another to love and good works,</span> not neglecting to meet together, as is the habit of some, but <span class="highlight">encouraging one another, and all the more as you see the Day drawing near.</span>'],
                            ['type' => 'prompts', 'questions' => [
                                "What does 'stir up' mean? Is it always comfortable?",
                                "Why mention 'the Day drawing near'? How should urgency affect our commitment?",
                                'What happens when we neglect meeting together? Have you experienced the drift?',
                            ]],
                            ['type' => 'leaderNote', 'text' => "'Stir up' (Greek: paroxysmos) means to provoke or incite—it's active, not passive. True community pushes us toward growth, which isn't always comfortable."],
                        ],
                    ],
                    [
                        'title' => 'Our Role in Community',
                        'icon' => '🎯',
                        'content' => [
                            ['type' => 'scripture', 'ref' => '1 Peter 4:10-11', 'text' => '<span class="highlight">As each has received a gift, use it to serve one another,</span> as good stewards of God\'s varied grace: whoever speaks, as one who speaks oracles of God; whoever serves, as one who serves by the strength that God supplies—<span class="highlight">in order that in everything God may be glorified</span> through Jesus Christ.'],
                            ['type' => 'prompts', 'questions' => [
                                'What gifts has God given you that you could use to serve THIS community?',
                                "What does it mean to be a 'steward' rather than an owner of your gifts?",
                                "How does the end goal—God's glory—shape how we use our gifts?",
                            ]],
                            ['type' => 'scripture', 'ref' => 'Galatians 6:2-5', 'text' => '<span class="highlight">Bear one another\'s burdens, and so fulfill the law of Christ.</span> For if anyone thinks he is something, when he is nothing, he deceives himself. But let each one test his own work, and then his reason to boast will be in himself alone and not in his neighbor. <span class="highlight">For each will have to bear his own load.</span>'],
                            ['type' => 'prompts', 'questions' => [
                                "How do we balance bearing others' burdens (v.2) with bearing our own load (v.5)?",
                                "What's the difference between a 'burden' and a 'load'?",
                            ]],
                            ['type' => 'leaderNote', 'text' => "'Burden' (Greek: baros) = crushing, overwhelming weight. 'Load' (Greek: phortion) = daily pack, normal responsibility. We help with crushing weights; we each carry our daily duties."],
                            ['type' => 'callout', 'title' => 'Key Insight: You Cannot Carry Everyone', 'content' => "Bearing burdens requires deep investment. You cannot truly bear the burdens of 500 people—or even 50. This is why your choice to be HERE matters. Over the coming weeks, we'll explore who God calls us to walk closely with and how to steward our limited capacity for the deepest levels of community."],
                        ],
                    ],
                    [
                        'title' => 'Closing: Establishing Our Foundation',
                        'icon' => '🏗️',
                        'content' => [
                            ['type' => 'scripture', 'ref' => 'Psalm 133:1', 'text' => 'Behold, <span class="highlight">how good and pleasant it is when brothers dwell together in unity!</span>'],
                            ['type' => 'prompts', 'questions' => [
                                "Based on tonight's discussion, what is one expectation you're adjusting about community?",
                                'What is one thing you commit to bringing to this group over the next six weeks?',
                            ]],
                        ],
                    ],
                ],
            ],
            2 => [
                'title' => 'Called to Community',
                'question' => "How is God's very nature a model for our togetherness—and our limits?",
                'icon' => '✨',
                'recap' => "Last week we examined our expectations and saw that God designed us for relationship from the very beginning. We recognized that our choice to invest in THIS community matters because our capacity for deep relationships is limited.",
                'nextWeek' => [
                    'title' => 'Marks of True Community',
                    'homework' => "Read through the 'one another' passages in the New Testament (there are over 50!). Pick 3-5 that stand out and consider: Which of these can be done with acquaintances? Which require deep, invested relationships?",
                ],
                'sections' => [
                    [
                        'title' => "The Trinity: Community in God's Nature",
                        'icon' => '✨',
                        'content' => [
                            ['type' => 'body', 'text' => "Community isn't something God invented for us—it's who He IS. Father, Son, and Holy Spirit have existed in perfect, loving community for all eternity."],
                            ['type' => 'scripture', 'ref' => 'Genesis 1:26', 'text' => 'Then God said, <span class="highlight">"Let us make man in our image, after our likeness."</span> And let them have dominion over the fish of the sea and over the birds of the heavens and over the livestock and over all the earth.'],
                            ['type' => 'prompts', 'questions' => [
                                "Why does God say 'us' and 'our'? What does this reveal about God's nature?",
                                "If we're made in the image of a RELATIONAL God, what does that mean for how we're designed to live?",
                            ]],
                            ['type' => 'leaderNote', 'text' => "This is the first hint of the Trinity. God exists eternally in community—Father, Son, Spirit—and creates us to reflect that relational nature."],
                            ['type' => 'scripture', 'ref' => 'John 17:20-23', 'text' => '"I do not ask for these only, but also for those who will believe in me through their word, <span class="highlight">that they may all be one, just as you, Father, are in me, and I in you,</span> that they also may be in us, <span class="highlight">so that the world may believe that you have sent me.</span> The glory that you have given me I have given to them, that they may be one even as we are one, I in them and you in me, <span class="highlight">that they may become perfectly one, so that the world may know</span> that you sent me and loved them even as you loved me."'],
                            ['type' => 'prompts', 'questions' => [
                                "How many times does Jesus mention 'one' in this passage? Why the repetition?",
                                'What is the PURPOSE of Christian unity according to verses 21 and 23?',
                                "Our unity is supposed to mirror the Trinity's unity. How does that raise the bar?",
                            ]],
                            ['type' => 'leaderNote', 'text' => "Our unity has EVANGELISTIC power! When we're unified, the world sees evidence of God. Disunity damages our witness."],
                        ],
                    ],
                    [
                        'title' => 'The Early Church Model',
                        'icon' => '⛪',
                        'content' => [
                            ['type' => 'scripture', 'ref' => 'Acts 2:42-47', 'text' => 'And they <span class="highlight">devoted themselves to the apostles\' teaching and the fellowship, to the breaking of bread and the prayers.</span> And awe came upon every soul, and many wonders and signs were being done through the apostles. And all who believed were together and <span class="highlight">had all things in common.</span> And they were selling their possessions and belongings and distributing the proceeds to all, as any had need. And <span class="highlight">day by day, attending the temple together and breaking bread in their homes,</span> they received their food with glad and generous hearts, praising God and having favor with all the people. <span class="highlight">And the Lord added to their number day by day</span> those who were being saved.'],
                            ['type' => 'prompts', 'questions' => [
                                'List the activities the early church devoted themselves to. Which stands out?',
                                "They met 'day by day'—in the temple AND in homes. What's the significance of both?",
                                'How is their community connected to evangelism (v.47)?',
                            ]],
                            ['type' => 'leaderNote', 'text' => 'Four devotions: teaching, fellowship, breaking bread, prayers. Note the balance of learning, relationship, sacrament, and spiritual practice.'],
                        ],
                    ],
                    [
                        'title' => 'The Wisdom of Limits',
                        'icon' => '⭕',
                        'content' => [
                            ['type' => 'body', 'text' => "Here's a crucial truth we must grasp: While God calls us to community, we are NOT God. God alone can be omnipresent, loving all people equally and infinitely. We are finite creatures with limited time, energy, and emotional capacity. This isn't failure—it's design."],
                            ['type' => 'callout', 'title' => 'Jesus Modeled Concentric Circles', 'content' => "<ul><li><strong>THE 3</strong> — Peter, James, and John went where others didn't: the Transfiguration, raising Jairus' daughter, Gethsemane</li><li><strong>THE 12</strong> — His disciples, chosen after a night of prayer</li><li><strong>THE 72</strong> — Sent on mission, trusted with kingdom work</li><li><strong>THE CROWDS</strong> — He taught them, healed them, had compassion</li><li><strong>THE WORLD</strong> — He loved all, died for all, but not all had equal access</li></ul>"],
                            ['type' => 'scripture', 'ref' => 'Luke 6:12-13', 'text' => 'In these days <span class="highlight">he went out to the mountain to pray, and all night he continued in prayer to God.</span> And when day came, <span class="highlight">he called his disciples and chose from them twelve,</span> whom he named apostles.'],
                            ['type' => 'prompts', 'questions' => [
                                'Jesus prayed ALL NIGHT before choosing the twelve. What does this tell us about selecting our inner circle?',
                                'If Jesus—who was God—limited His inner circle, what does that mean for us?',
                                "Does having 'circles' mean we love some people less? Or love them differently?",
                            ]],
                            ['type' => 'leaderNote', 'text' => "Jesus wasn't being exclusive or unloving—He was being INTENTIONAL. Depth requires focus. We honor people by being honest about our capacity rather than spreading ourselves impossibly thin."],
                            ['type' => 'scripture', 'ref' => 'Mark 1:35-38', 'text' => 'And rising very early in the morning, <span class="highlight">while it was still dark, he departed and went out to a desolate place, and there he prayed.</span> And Simon and those who were with him searched for him, and they found him and said to him, <span class="highlight">\'Everyone is looking for you.\'</span> And he said to them, <span class="highlight">\'Let us go on to the next towns,</span> that I may preach there also, for that is why I came out.\'"'],
                            ['type' => 'prompts', 'questions' => [
                                "'Everyone is looking for you'—yet Jesus LEFT. How do you respond to this?",
                                "What does this teach us about saying 'no' even to good things and needy people?",
                                'How did Jesus decide where to invest His limited time? (Hint: v.35)',
                            ]],
                            ['type' => 'leaderNote', 'text' => "Jesus withdrew to pray. His priorities came from the Father, not from the pressure of demands. We too must seek God's direction for where to invest deeply."],
                        ],
                    ],
                    [
                        'title' => 'Biblical Criteria for Your Inner Circles',
                        'icon' => '📋',
                        'content' => [
                            ['type' => 'body', 'text' => "If we can't go deep with everyone, how do we discern who belongs in our closest circles? Scripture gives us guidance:"],
                            ['type' => 'scripture', 'ref' => 'Proverbs 13:20', 'text' => '<span class="highlight">Whoever walks with the wise becomes wise,</span> but the companion of fools will suffer harm.'],
                            ['type' => 'scripture', 'ref' => 'Amos 3:3', 'text' => '<span class="highlight">Do two walk together, unless they have agreed</span> to meet?'],
                            ['type' => 'scripture', 'ref' => '2 Corinthians 6:14', 'text' => '<span class="highlight">Do not be unequally yoked with unbelievers.</span> For what partnership has righteousness with lawlessness? Or what fellowship has light with darkness?'],
                            ['type' => 'scripture', 'ref' => 'Galatians 6:10', 'text' => 'So then, as we have opportunity, let us do good to everyone, and <span class="highlight">especially to those who are of the household of faith.</span>'],
                            ['type' => 'callout', 'title' => 'Criteria for Deep Community', 'content' => "<ul><li><strong>SHARED FAITH</strong> — Our deepest community should be with believers</li><li><strong>SHARED DIRECTION</strong> — Walking the same way, toward Christ</li><li><strong>WISDOM & CHARACTER</strong> — People who make you better, not worse</li><li><strong>MUTUAL INVESTMENT</strong> — Both giving and receiving</li><li><strong>SPIRIT-LED DISCERNMENT</strong> — Prayerfully asking God who He's calling you toward</li></ul>"],
                            ['type' => 'prompts', 'questions' => [
                                'Look at these criteria. How do they apply to this group?',
                                'Is there anyone God might be calling you to move closer to? Anyone you need to create healthy distance from?',
                                'How do we love people genuinely while still having boundaries on our deepest investment?',
                            ]],
                            ['type' => 'leaderNote', 'text' => "Be sensitive here—this isn't about ranking people's worth. It's about stewarding our finite capacity. We can love everyone while recognizing we can only go DEEP with few."],
                        ],
                    ],
                    [
                        'title' => 'Closing Reflection',
                        'icon' => '🌅',
                        'content' => [
                            ['type' => 'body', 'text' => "We are called to community because it reflects God's nature. But we are also called to WISDOM in community—recognizing our limits and seeking God's direction for where to invest most deeply."],
                            ['type' => 'prompts', 'questions' => [
                                "How does understanding 'concentric circles' free you rather than burden you?",
                                'What aspect of early church community most inspires you? Most challenges you?',
                                'Who might God be calling you to invest in more deeply?',
                            ]],
                        ],
                    ],
                ],
            ],
            3 => [
                'title' => 'Marks of True Community',
                'question' => 'What does biblical fellowship actually look like in practice?',
                'icon' => '💎',
                'recap' => "Last week we discovered that community reflects God's Trinitarian nature. We also learned that even Jesus operated in concentric circles—going deepest with the few. We explored biblical criteria for our inner circles: shared faith, shared direction, wisdom, mutual investment, and Spirit-led discernment.",
                'nextWeek' => [
                    'title' => 'Barriers to Community',
                    'homework' => 'Identify one barrier that keeps you from deeper community (fear, busyness, past hurt, pride, over-extension). Write it down and pray about it. Come ready to discuss as you\'re comfortable.',
                ],
                'sections' => [
                    [
                        'title' => "The 'One Another' Commands",
                        'icon' => '📜',
                        'content' => [
                            ['type' => 'body', 'text' => "The New Testament contains over 50 'one another' commands—instructions that can ONLY be obeyed in community. These reveal the distinguishing marks of true Christian fellowship."],
                            ['type' => 'callout', 'title' => "Why 'One Anothers' Require Inner Circles", 'content' => "Notice: these commands require CAPACITY. You cannot genuinely bear 200 people's burdens. You cannot confess vulnerably to a crowd. You cannot deeply encourage someone you barely know. The 'one another' commands are only possible in your inner circles—which is why last week's lesson on choosing wisely matters so much."],
                        ],
                    ],
                    [
                        'title' => 'Love One Another',
                        'icon' => '❤️',
                        'content' => [
                            ['type' => 'scripture', 'ref' => 'John 13:34-35', 'text' => '<span class="highlight">A new commandment I give to you, that you love one another: just as I have loved you,</span> you also are to love one another. <span class="highlight">By this all people will know that you are my disciples,</span> if you have love for one another.'],
                            ['type' => 'prompts', 'questions' => [
                                "Jesus calls this 'new.' What's new about it? (Look at the standard He sets.)",
                                'How did Jesus love His disciples? What does that standard require of us?',
                                'Our love is supposed to be VISIBLE evidence to the world. Is your love for Christians visible?',
                            ]],
                            ['type' => 'leaderNote', 'text' => "The 'new' part is the standard: 'as I have loved you.' Jesus loved to the point of death. This infinitely raises the bar beyond 'be nice.'"],
                            ['type' => 'scripture', 'ref' => 'Romans 12:10', 'text' => '<span class="highlight">Love one another with brotherly affection. Outdo one another in showing honor.</span>'],
                            ['type' => 'prompts', 'questions' => [
                                "'Brotherly affection' (Greek: philostorge) was used for family love. What does treating the church as FAMILY mean?",
                                "What would a 'competition' to outdo one another in honor look like in our group?",
                            ]],
                        ],
                    ],
                    [
                        'title' => 'Encourage & Build Up',
                        'icon' => '💪',
                        'content' => [
                            ['type' => 'scripture', 'ref' => '1 Thessalonians 5:11', 'text' => 'Therefore <span class="highlight">encourage one another and build one another up,</span> just as you are doing.'],
                            ['type' => 'scripture', 'ref' => 'Hebrews 3:13', 'text' => 'But <span class="highlight">exhort one another every day,</span> as long as it is called \'today,\' <span class="highlight">that none of you may be hardened by the deceitfulness of sin.</span>'],
                            ['type' => 'prompts', 'questions' => [
                                "Why 'every day'? What happens when encouragement is only occasional?",
                                "How does sin 'harden' us? How does daily encouragement prevent this?",
                                'Who could you encourage this week? How specifically?',
                            ]],
                            ['type' => 'leaderNote', 'text' => "Sin is deceitful—it convinces us we're fine alone, that we don't need others, that our choices are justified. Regular community breaks through these lies."],
                        ],
                    ],
                    [
                        'title' => 'Serve One Another',
                        'icon' => '🙏',
                        'content' => [
                            ['type' => 'scripture', 'ref' => 'Galatians 5:13', 'text' => 'For you were called to freedom, brothers. Only <span class="highlight">do not use your freedom as an opportunity for the flesh, but through love serve one another.</span>'],
                            ['type' => 'scripture', 'ref' => '1 Peter 4:9-10', 'text' => '<span class="highlight">Show hospitality to one another without grumbling.</span> As each has received a gift, <span class="highlight">use it to serve one another,</span> as good stewards of God\'s varied grace.'],
                            ['type' => 'prompts', 'questions' => [
                                'Freedom in Christ enables SERVICE, not independence. How does this challenge individualism?',
                                "'Without grumbling'—what does reluctant service communicate?",
                                'What gift has God given you to serve this community?',
                            ]],
                        ],
                    ],
                    [
                        'title' => 'Bear Burdens & Confess',
                        'icon' => '🤲',
                        'content' => [
                            ['type' => 'scripture', 'ref' => 'Galatians 6:2', 'text' => '<span class="highlight">Bear one another\'s burdens, and so fulfill the law of Christ.</span>'],
                            ['type' => 'scripture', 'ref' => 'James 5:16', 'text' => 'Therefore, <span class="highlight">confess your sins to one another and pray for one another, that you may be healed.</span> The prayer of a righteous person has great power as it is working.'],
                            ['type' => 'prompts', 'questions' => [
                                'Why does James connect confession with HEALING?',
                                'What makes confession in community so difficult? What makes it so powerful?',
                                'What would it take for this group to become a safe place for confession?',
                            ]],
                            ['type' => 'leaderNote', 'text' => 'Confession requires vulnerability and trust. Consider together: What would need to be true about our group for people to feel safe confessing struggles?'],
                            ['type' => 'callout', 'title' => 'The Depth Requirement', 'content' => "Notice something: NONE of these 'one another' commands can be done well with strangers. Speaking truth in love? That requires relationship. Faithful wounds? That requires trust built over time. Confession? That requires proven confidentiality. The 'one another' commands DEMAND the kind of investment we discussed last week. This is why you can't go deep with everyone—and why THIS group matters."],
                        ],
                    ],
                    [
                        'title' => 'Closing: Evaluating Our Community',
                        'icon' => '📊',
                        'content' => [
                            ['type' => 'prompts', 'questions' => [
                                "Which 'one another' command do we do well as a group? Which do we need to grow in?",
                                "What's one specific way you will practice one of these commands this week?",
                                'Who in your life—inside or outside this group—needs you to practice these commands with them?',
                            ]],
                        ],
                    ],
                ],
            ],
            4 => [
                'title' => 'Barriers to Community',
                'question' => 'What keeps us from the depth God intends for His people?',
                'icon' => '🚧',
                'recap' => "Last week we examined the 'one another' commands—over 50 ways Scripture calls us to love, encourage, serve, bear burdens, and confess with each other. We recognized that these commands REQUIRE deep investment, which is why choosing your inner circles wisely matters.",
                'nextWeek' => [
                    'title' => 'Fruit of Community',
                    'homework' => 'Reflect on a time when Christian community produced visible fruit in your life—growth, accountability, comfort, or mission. Come prepared to share your story.',
                ],
                'sections' => [
                    [
                        'title' => 'Naming the Barriers',
                        'icon' => '🚧',
                        'content' => [
                            ['type' => 'body', 'text' => "If community is so central to God's design, why is it so hard? Let's honestly examine the barriers that keep us from the depth Scripture describes."],
                        ],
                    ],
                    [
                        'title' => 'The Barrier of Fear',
                        'icon' => '😰',
                        'content' => [
                            ['type' => 'scripture', 'ref' => '1 John 4:18', 'text' => '<span class="highlight">There is no fear in love, but perfect love casts out fear.</span> For fear has to do with punishment, and whoever fears has not been perfected in love.'],
                            ['type' => 'prompts', 'questions' => [
                                'What specific fears keep people from deep community?',
                                "How does love 'cast out' fear? Have you experienced this?",
                                'What would it look like for our group to be a place where fear is cast out?',
                            ]],
                            ['type' => 'leaderNote', 'text' => "Common fears: being truly known and rejected, vulnerability being used against us, past hurts repeating, not measuring up."],
                            ['type' => 'scripture', 'ref' => '2 Timothy 1:7', 'text' => 'For <span class="highlight">God gave us a spirit not of fear but of power and love and self-control.</span>'],
                            ['type' => 'prompts', 'questions' => [
                                "Fear doesn't come from God. How does remembering this help us step into community?",
                            ]],
                        ],
                    ],
                    [
                        'title' => 'The Barrier of Pride',
                        'icon' => '👑',
                        'content' => [
                            ['type' => 'scripture', 'ref' => 'Proverbs 16:18', 'text' => '<span class="highlight">Pride goes before destruction,</span> and a haughty spirit before a fall.'],
                            ['type' => 'scripture', 'ref' => 'James 4:6', 'text' => 'But he gives more grace. Therefore it says, <span class="highlight">\'God opposes the proud but gives grace to the humble.\'</span>'],
                            ['type' => 'prompts', 'questions' => [
                                'How does pride show up in community?',
                                "Why does God 'oppose' the proud?",
                                'What does humility actually look like in a small group setting?',
                            ]],
                            ['type' => 'leaderNote', 'text' => "Pride says 'I don't need anyone' or 'I have it all together.' Humility admits need and weakness."],
                            ['type' => 'scripture', 'ref' => 'Philippians 2:3-4', 'text' => '<span class="highlight">Do nothing from selfish ambition or conceit, but in humility count others more significant than yourselves.</span> Let each of you <span class="highlight">look not only to his own interests, but also to the interests of others.</span>'],
                            ['type' => 'prompts', 'questions' => [
                                "'Count others more significant'—how does this counter our natural tendencies?",
                                "Notice Paul says 'not ONLY to your own interests'—caring for yourself isn't wrong. How do you find balance?",
                            ]],
                        ],
                    ],
                    [
                        'title' => 'The Barrier of Sin & Unforgiveness',
                        'icon' => '⛓️',
                        'content' => [
                            ['type' => 'scripture', 'ref' => 'Matthew 18:21-22', 'text' => 'Then Peter came up and said to him, \'Lord, how often will my brother sin against me, and I forgive him? As many as seven times?\' Jesus said to him, <span class="highlight">\'I do not say to you seven times, but seventy-seven times.\'</span>'],
                            ['type' => 'prompts', 'questions' => [
                                'Peter thought seven times was generous! Why does Jesus say seventy-seven?',
                                'What happens to community when we keep count of wrongs?',
                            ]],
                            ['type' => 'leaderNote', 'text' => "Jesus isn't giving a literal number—He's saying forgiveness should be unlimited."],
                            ['type' => 'scripture', 'ref' => 'Colossians 3:13', 'text' => 'Bearing with one another and, if one has a complaint against another, <span class="highlight">forgiving each other; as the Lord has forgiven you,</span> so you also must forgive.'],
                            ['type' => 'prompts', 'questions' => [
                                'The standard for our forgiveness is how much GOD has forgiven US. How much is that?',
                                'What does unforgiveness do to the person holding it?',
                                'Is there anyone you need to forgive to remove a barrier to deeper community?',
                            ]],
                        ],
                    ],
                    [
                        'title' => 'The Barrier of Busyness',
                        'icon' => '⏰',
                        'content' => [
                            ['type' => 'scripture', 'ref' => 'Luke 10:40-42', 'text' => 'But Martha was distracted with much serving. And she went up to him and said, \'Lord, do you not care that my sister has left me to serve alone? Tell her then to help me.\' But the Lord answered her, \'Martha, Martha, you are anxious and troubled about many things, but <span class="highlight">one thing is necessary. Mary has chosen the good portion,</span> which will not be taken away from her.\''],
                            ['type' => 'prompts', 'questions' => [
                                'Martha was doing GOOD things—serving! Why did Jesus gently correct her?',
                                "What 'good things' distract you from the 'one thing necessary'—being present?",
                                "How does our culture's pace work against deep community?",
                            ]],
                            ['type' => 'leaderNote', 'text' => 'Busyness is praised in our culture. But Jesus valued presence over productivity.'],
                        ],
                    ],
                    [
                        'title' => 'The Barrier of Over-Extension',
                        'icon' => '🔄',
                        'content' => [
                            ['type' => 'body', 'text' => "Here's a barrier we don't often name: trying to go deep with EVERYONE and therefore going deep with NO ONE."],
                            ['type' => 'scripture', 'ref' => 'Luke 5:15-16', 'text' => 'But now even more the report about him went abroad, and <span class="highlight">great crowds gathered to hear him and to be healed of their infirmities. But he would withdraw to desolate places and pray.</span>'],
                            ['type' => 'prompts', 'questions' => [
                                'Crowds were gathering. Needs were everywhere. Yet Jesus WITHDREW. Why?',
                                "Do you struggle to say 'no' even when you're depleted?",
                                "What's the difference between loving everyone and trying to be everything to everyone?",
                            ]],
                            ['type' => 'callout', 'title' => 'The Over-Extension Trap', 'content' => "<ul><li><strong>TRYING TO GO DEEP WITH EVERYONE</strong> = going deep with no one</li><li><strong>INABILITY TO SAY 'NO'</strong> = exhausted, shallow relationships</li><li><strong>GUILT OVER PRIORITIZING</strong> = prevents the focus that depth requires</li><li><strong>CONFUSING 'LOVING ALL' WITH 'BEING ALL THINGS TO ALL'</strong> = only God can do the latter</li></ul>"],
                        ],
                    ],
                    [
                        'title' => 'Breaking Down the Barriers',
                        'icon' => '🔨',
                        'content' => [
                            ['type' => 'scripture', 'ref' => 'Ephesians 2:14-16', 'text' => 'For <span class="highlight">he himself is our peace, who has made us both one and has broken down in his flesh the dividing wall of hostility</span> by abolishing the law of commandments expressed in ordinances, that he might create in himself one new man in place of the two, so making peace, and might <span class="highlight">reconcile us both to God in one body through the cross,</span> thereby killing the hostility.'],
                            ['type' => 'prompts', 'questions' => [
                                'Jesus broke down the ULTIMATE barrier. What does this tell us about His power over our barriers?',
                                'How does the cross address fear? Pride? Sin? Busyness?',
                            ]],
                            ['type' => 'leaderNote', 'text' => 'The cross addresses: FEAR (perfect love demonstrated), PRIDE (we all needed a Savior), SIN (forgiven!), BUSYNESS (the most important thing is already done for us).'],
                        ],
                    ],
                    [
                        'title' => 'Closing: Honest Inventory',
                        'icon' => '📝',
                        'content' => [
                            ['type' => 'prompts', 'questions' => [
                                'Which barrier resonates most with you: fear, pride, unforgiveness, busyness, or over-extension?',
                                'What is one concrete step you can take this week to address that barrier?',
                                'How can this group help you break through?',
                            ]],
                        ],
                    ],
                ],
            ],
            5 => [
                'title' => 'Fruit of Community',
                'question' => 'What does healthy, focused community actually produce?',
                'icon' => '🌱',
                'recap' => "Last week we confronted barriers to deep community—fear, pride, sin, busyness, and over-extension. We saw that Jesus breaks down dividing walls and empowers us to do the same.",
                'nextWeek' => [
                    'title' => 'Committing to Community',
                    'homework' => 'Prayerfully consider: What is your commitment to THIS community moving forward? What will you give? What do you need? Come ready to make a covenant together.',
                ],
                'sections' => [
                    [
                        'title' => 'The Principle of Depth Over Breadth',
                        'icon' => '🌳',
                        'content' => [
                            ['type' => 'body', 'text' => "Before we explore the fruit of community, let's establish a crucial principle: Fruit only grows from DEEP roots."],
                            ['type' => 'callout', 'title' => 'The Tree Analogy', 'content' => 'A tree with roots spread an inch deep across a mile produces nothing. A tree with roots driven deep into good soil in one place bears abundant fruit. The same is true for community. Shallow relationships with many will never produce what focused investment with few will produce.'],
                        ],
                    ],
                    [
                        'title' => 'Spiritual Growth',
                        'icon' => '📈',
                        'content' => [
                            ['type' => 'body', 'text' => "One of the primary fruits of biblical community is spiritual growth. We don't mature in isolation—we grow together."],
                            ['type' => 'scripture', 'ref' => 'Proverbs 27:17', 'text' => '<span class="highlight">Iron sharpens iron, and one man sharpens another.</span>'],
                            ['type' => 'scripture', 'ref' => 'Ephesians 4:15-16', 'text' => 'Rather, <span class="highlight">speaking the truth in love, we are to grow up in every way into him who is the head, into Christ,</span> from whom the whole body, joined and held together by every joint with which it is equipped, when each part is working properly, <span class="highlight">makes the body grow so that it builds itself up in love.</span>'],
                            ['type' => 'prompts', 'questions' => [
                                "How has someone in Christian community 'sharpened' you spiritually?",
                                "What does 'speaking the truth in love' look like?",
                                "The body 'builds itself up in love'—growth happens THROUGH love. How have you experienced this?",
                            ]],
                            ['type' => 'leaderNote', 'text' => 'Growth requires both truth AND love. Truth without love is harsh; love without truth is permissive.'],
                        ],
                    ],
                    [
                        'title' => 'Accountability & Protection',
                        'icon' => '🛡️',
                        'content' => [
                            ['type' => 'scripture', 'ref' => 'Ecclesiastes 4:9-10, 12', 'text' => 'Two are better than one, because they have a good reward for their toil. <span class="highlight">For if they fall, one will lift up his fellow. But woe to him who is alone when he falls</span> and has not another to lift him up!... And though a man might prevail against one who is alone, <span class="highlight">two will withstand him—a threefold cord is not quickly broken.</span>'],
                            ['type' => 'prompts', 'questions' => [
                                "'Woe to him who is alone when he falls'—what kinds of 'falls' does community help prevent or recover from?",
                                'Two can withstand attacks that one cannot. What attacks does the enemy make that we need others to stand with us against?',
                                'Do you have someone who would notice if you started to wander?',
                            ]],
                            ['type' => 'leaderNote', 'text' => "Accountability isn't policing—it's PROTECTION. We're stronger together against temptation, discouragement, and spiritual attack."],
                        ],
                    ],
                    [
                        'title' => 'Comfort & Burden-Bearing',
                        'icon' => '🤗',
                        'content' => [
                            ['type' => 'scripture', 'ref' => '2 Corinthians 1:3-4', 'text' => 'Blessed be the God and Father of our Lord Jesus Christ, the Father of mercies and God of all comfort, <span class="highlight">who comforts us in all our affliction, so that we may be able to comfort those who are in any affliction,</span> with the comfort with which we ourselves are comforted by God.'],
                            ['type' => 'prompts', 'questions' => [
                                'God comforts us SO THAT we can comfort others. How has your suffering equipped you to help someone else?',
                                'Have you received comfort from this community? What made it meaningful?',
                            ]],
                            ['type' => 'leaderNote', 'text' => 'Our pain is never wasted. God redeems suffering by using it to equip us to minister to others.'],
                            ['type' => 'scripture', 'ref' => 'Romans 12:15', 'text' => '<span class="highlight">Rejoice with those who rejoice, weep with those who weep.</span>'],
                            ['type' => 'prompts', 'questions' => [
                                "Why is it sometimes harder to 'rejoice with those who rejoice' than to 'weep with those who weep'?",
                                'What burden are you carrying that you could share with this group?',
                            ]],
                        ],
                    ],
                    [
                        'title' => 'Joy & Celebration',
                        'icon' => '🎉',
                        'content' => [
                            ['type' => 'scripture', 'ref' => 'Psalm 133:1', 'text' => 'Behold, <span class="highlight">how good and pleasant it is when brothers dwell together in unity!</span>'],
                            ['type' => 'scripture', 'ref' => 'Acts 2:46-47', 'text' => 'And day by day, attending the temple together and breaking bread in their homes, <span class="highlight">they received their food with glad and generous hearts,</span> praising God and having favor with all the people.'],
                            ['type' => 'prompts', 'questions' => [
                                "'Good and pleasant'—community is supposed to be ENJOYABLE! Do we sometimes make it too heavy?",
                                'The early church had \'glad and generous hearts.\' What brings you JOY in Christian community?',
                                'How can we celebrate together more?',
                            ]],
                            ['type' => 'leaderNote', 'text' => "Community isn't all burden-bearing—it's also celebration, laughter, and shared joy. Make sure your group has FUN together!"],
                        ],
                    ],
                    [
                        'title' => 'Mission & Witness',
                        'icon' => '🌍',
                        'content' => [
                            ['type' => 'scripture', 'ref' => 'John 13:35', 'text' => '<span class="highlight">By this all people will know that you are my disciples, if you have love for one another.</span>'],
                            ['type' => 'scripture', 'ref' => 'John 17:21', 'text' => 'That they may all be one, just as you, Father, are in me, and I in you, that they also may be in us, <span class="highlight">so that the world may believe that you have sent me.</span>'],
                            ['type' => 'prompts', 'questions' => [
                                'Our love and unity are supposed to be EVIDENCE to the watching world. What do outsiders see when they look at your community?',
                                'How has your community been a witness to unbelievers?',
                            ]],
                            ['type' => 'leaderNote', 'text' => 'The early church grew not primarily through programs but through VISIBLE LOVE. Our community IS our evangelism strategy.'],
                            ['type' => 'callout', 'title' => 'The Fruit Requires the Root', 'content' => "Every fruit we've discussed tonight—growth, accountability, comfort, joy, mission—only comes from DEEP community. You cannot experience these with a hundred acquaintances. They require the kind of focused, invested, vulnerable relationships we've been studying. The question isn't 'Is community good?' The question is: 'Am I investing deeply enough to experience its fruit?'"],
                        ],
                    ],
                    [
                        'title' => 'Closing: Testimonies',
                        'icon' => '📢',
                        'content' => [
                            ['type' => 'prompts', 'questions' => [
                                'Share a time when Christian community produced visible fruit in your life.',
                                'Which fruit do you most NEED from community right now?',
                                'Which fruit are you most positioned to GIVE?',
                            ]],
                        ],
                    ],
                ],
            ],
            6 => [
                'title' => 'Committing to Community',
                'question' => 'Are we ready to choose these people, this place, this investment?',
                'icon' => '🤝',
                'recap' => "Last week we celebrated the fruit of deep community—spiritual growth, accountability, comfort, joy, and mission. We recognized that these fruits only grow from deep roots.",
                'nextWeek' => null,
                'sections' => [
                    [
                        'title' => 'Reviewing Our Journey',
                        'icon' => '🗺️',
                        'content' => [
                            ['type' => 'body', 'text' => "Over six weeks, we've explored God's design for biblical community. Before we commit to moving forward, let's remember where we've been."],
                            ['type' => 'callout', 'title' => 'Our Journey Together', 'content' => "<ul><li><strong>WEEK 1</strong> — We examined our expectations and recognized we'd already chosen to invest HERE</li><li><strong>WEEK 2</strong> — We saw community reflects God's nature AND that Jesus modeled concentric circles</li><li><strong>WEEK 3</strong> — We explored 'one another' commands that require deep, focused investment</li><li><strong>WEEK 4</strong> — We confronted barriers: fear, pride, sin, busyness, over-extension</li><li><strong>WEEK 5</strong> — We celebrated fruit that only grows from deep roots</li></ul>"],
                            ['type' => 'prompts', 'questions' => [
                                "Which week's teaching impacted you most? Why?",
                                'What has shifted in your understanding or practice of community over these six weeks?',
                            ]],
                        ],
                    ],
                    [
                        'title' => 'The Cost of Commitment',
                        'icon' => '💰',
                        'content' => [
                            ['type' => 'scripture', 'ref' => 'Luke 14:28-30', 'text' => '<span class="highlight">For which of you, desiring to build a tower, does not first sit down and count the cost,</span> whether he has enough to complete it? Otherwise, when he has laid a foundation and is not able to finish, all who see it begin to mock him, saying, \'This man began to build and was not able to finish.\''],
                            ['type' => 'prompts', 'questions' => [
                                'Jesus says to COUNT THE COST before committing. What does genuine commitment to community cost?',
                                'What might you have to give up or rearrange to prioritize this community?',
                                'Is the cost worth the fruit we discussed last week?',
                            ]],
                            ['type' => 'leaderNote', 'text' => "Be honest about costs: time, energy, vulnerability, flexibility, sacrifice. But remind them of the value—the fruit only comes from this investment."],
                            ['type' => 'scripture', 'ref' => 'Ruth 1:16-17', 'text' => 'But Ruth said, \'Do not urge me to leave you or to return from following you. <span class="highlight">For where you go I will go, and where you lodge I will lodge. Your people shall be my people, and your God my God.</span> Where you die I will die, and there will I be buried.\''],
                            ['type' => 'prompts', 'questions' => [
                                "Ruth's commitment to Naomi was total and lifelong. What can we learn from her example?",
                                'What level of commitment is appropriate for THIS group at THIS stage?',
                            ]],
                        ],
                    ],
                    [
                        'title' => 'Choosing These People',
                        'icon' => '👥',
                        'content' => [
                            ['type' => 'body', 'text' => "This commitment isn't abstract. You're not committing to 'community' as a nice idea. You're committing to THESE faces, THESE names, THESE people in this room."],
                            ['type' => 'scripture', 'ref' => '1 Corinthians 12:18', 'text' => 'But as it is, <span class="highlight">God arranged the members in the body, each one of them, as he chose.</span>'],
                            ['type' => 'prompts', 'questions' => [
                                "God ARRANGED the members of the body—including placing you in this group. Do you believe that?",
                                'How does seeing your placement here as God\'s design change your commitment?',
                            ]],
                            ['type' => 'callout', 'title' => 'The Intentionality of Jesus', 'content' => "Remember Week 2: Jesus prayed ALL NIGHT before choosing the twelve (Luke 6:12). He was intentional about His inner circle. By committing to this group, you are being intentional too. You're saying: 'Among all the people I could spend time with, I'm choosing to invest HERE. These are my people for this season.' This is holy. This is what Jesus modeled."],
                        ],
                    ],
                    [
                        'title' => 'Practical Commitments',
                        'icon' => '✅',
                        'content' => [
                            ['type' => 'scripture', 'ref' => 'Hebrews 10:24-25', 'text' => 'And let us consider how to stir up one another to love and good works, <span class="highlight">not neglecting to meet together, as is the habit of some,</span> but encouraging one another, and all the more as you see the Day drawing near.'],
                            ['type' => 'prompts', 'questions' => [
                                "'Not neglecting to meet together'—what does consistent attendance communicate?",
                                'What does inconsistent attendance communicate—to the group and to yourself?',
                            ]],
                            ['type' => 'callout', 'title' => 'Areas of Commitment', 'content' => "<ul><li><strong>PRESENCE</strong> — I will prioritize attending and being fully present</li><li><strong>PARTICIPATION</strong> — I will engage actively, not just observe</li><li><strong>PRAYER</strong> — I will pray for members regularly</li><li><strong>VULNERABILITY</strong> — I will take appropriate risks to be known</li><li><strong>SERVICE</strong> — I will look for ways to serve and meet needs</li><li><strong>CONFIDENTIALITY</strong> — What's shared here stays here</li><li><strong>GRACE</strong> — I will extend grace when others fall short</li><li><strong>PRIORITY</strong> — I'm choosing to invest my limited capacity HERE</li></ul>"],
                        ],
                    ],
                    [
                        'title' => 'Our Covenant Together',
                        'icon' => '📜',
                        'content' => [
                            ['type' => 'body', 'text' => "Let's close by making a covenant—a formal commitment to pursue biblical community with these specific people."],
                            ['type' => 'scripture', 'ref' => 'Joshua 24:15', 'text' => 'And if it is evil in your eyes to serve the LORD, choose this day whom you will serve, whether the gods your fathers served in the region beyond the River, or the gods of the Amorites in whose land you dwell. <span class="highlight">But as for me and my house, we will serve the LORD.</span>'],
                            ['type' => 'callout', 'title' => 'Our Community Covenant', 'content' => "<strong>By God's grace and with the Holy Spirit's help, we commit to:</strong><ul><li>Gathering consistently, making our time together a priority</li><li>Being fully present—physically, mentally, and emotionally</li><li>Pursuing authenticity and appropriate vulnerability</li><li>Speaking truth in love and receiving truth with grace</li><li>Praying for one another faithfully</li><li>Bearing one another's burdens and celebrating one another's joys</li><li>Extending forgiveness quickly and freely</li><li>Maintaining confidentiality and building trust</li><li>Serving one another and looking outward together in mission</li><li>Recognizing our finite capacity and choosing to invest it HERE</li><li>Pointing one another to Jesus in all things</li></ul>"],
                        ],
                    ],
                    [
                        'title' => 'Closing Prayer & Celebration',
                        'icon' => '🎊',
                        'content' => [
                            ['type' => 'body', 'text' => "Let's close in prayer, thanking God for bringing us together and asking Him to build us into the community He designed us to be. Then—let's CELEBRATE! God has done a good work."],
                            ['type' => 'scripture', 'ref' => 'Psalm 133:1-3', 'text' => 'Behold, <span class="highlight">how good and pleasant it is when brothers dwell together in unity!</span> It is like the precious oil on the head, running down on the beard, on the beard of Aaron, running down on the collar of his robes! It is like the dew of Hermon, which falls on the mountains of Zion! <span class="highlight">For there the LORD has commanded the blessing, life forevermore.</span>'],
                            ['type' => 'prompts', 'questions' => [
                                'What are you most GRATEFUL for about this community?',
                                'What is one word to describe your hope for us going forward?',
                            ]],
                        ],
                    ],
                ],
            ],
        ];
    }
}
