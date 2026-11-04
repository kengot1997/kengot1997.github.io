// Keys are the original text in index.html. Update a key when its source text changes.
const toJapanese = {
  "Profile": "プロフィール",
  "Projects": "プロジェクト",
  "Research Projects": "研究プロジェクト",
  "Publications": "論文・発表",
  "Resume / CV": "経歴・受賞",
  "Ph.D. Student, University of Tsukuba": "筑波大学大学院 博士後期課程",
  "Research interests": "研究分野",
  "Bio": "略歴",
  "Affiliation": "所属",
  "University of Tsukuba / Miraikan": "筑波大学 / 日本科学未来館",
  "Journal Papers": "学術誌論文",
  "International Conferences": "国際会議論文",
  "Posters & short papers": "ポスター・ショートペーパー",
  "Preprints": "プレプリント",
  "Demos": "デモ",
  "Video showcase": "ビデオショーケース",
  "Peer reviewed": "査読あり",
  "Preprint": "プレプリント",
  "Best Movie Award Top 3": "Best Movie Award トップ3",
  "Awards": "受賞",
  "Work": "職歴・研究員業務",
  "Education": "学歴",
  "Grants & fellowships": "研究助成・支援",
  "Talks & activities": "講演・活動",
  "Back to top": "ページ上部へ"
};

const toEnglish = {
  "本文へ移動": "Skip to main content",
  "2026–現在": "2026–present",
  "2025–現在": "2025–present",
  "2026年4月–現在": "Apr 2026 – present",
  "2025年3月–現在": "Mar 2025 – present",
  "2025年4月–2026年3月": "Apr 2025 – Mar 2026",
  "2025年3月": "Mar 2025",
  "2024年2月": "Feb 2024",
  "2023年12月": "Dec 2023",
  "2026年2月11日": "Feb 11, 2026",
  "2026年9月26日": "Sep 26, 2026",
  "2025年11月10日": "Nov 10, 2025",
  "2025年7月31日": "Jul 31, 2025",
  "2025年2月11日": "Feb 11, 2025",
  "2024年11月17日": "Nov 17, 2024",
  "2024年10月9日": "Oct 9, 2024",
  "2024年9月20日": "Sep 20, 2024",
  "2023年8月10日": "Aug 10, 2023",
  "2023年7月–8月": "Jul–Aug 2023",
  "2022年4月": "Apr 2022",
  "2021年3月": "Mar 2021",
  "2018年2月": "Feb 2018",
  "2024年4月–現在": "Apr 2024 – present",
  "2023年4月–2024年9月": "Apr 2023 – Sep 2024",
  "2021年4月–2023年3月": "Apr 2021 – Mar 2023",
  "2017年4月–2021年3月": "Apr 2017 – Mar 2021",
  "アクセシビリティと Human-Computer Interaction を中心に、触覚グラフィックス、視覚障害者の身体動作学習支援、インクルーシブなスポーツなどを研究しています。": "I study accessibility and human-computer interaction, focusing on tactile graphics, movement learning for blind people, and inclusive sports.",
  "VRで視覚を使わずに対象を探し、正確に位置を合わせるための音声ガイダンス。": "Auditory guidance for finding and precisely aligning targets in VR without vision.",
  "卓上ヒューマノイドロボットの動きを触って学ぶ、視覚障害者向けの動作学習。": "Tactile motion learning for blind people using a tabletop humanoid robot.",
  "3Dの触覚模型を使い、視覚障害者の身体動作学習を支援する研究。": "Supporting blind people in learning body movements with 3D tactile models.",
  "回転台に並べた3Dプリント模型で、動きの連続を触って理解する研究。": "Exploring movement sequences through 3D-printed poses on a rotating table.",
  "生成AIを用い、絵本のイラストから触覚グラフィックスを共創する研究。": "Co-creating tactile graphics from picture-book illustrations with generative AI.",
  "ロービジョンの人と共に設計したキックボクシング体験。": "A kickboxing experience designed with people with low vision.",
  "集束超音波を用いて、アクリル板に触れられる凹凸をつくる研究。": "Creating tactile embossments on acrylic sheets using focused ultrasound.",
  "生成AIとデジタルファブリケーションを活用した、触れる絵本の制作。": "Creating tactile picture books with generative AI and digital fabrication.",
  "ロービジョンの参列者が披露宴の様子や場所を把握できるよう、映像配信と音響で支援する研究。": "Supporting guests with low vision at a wedding reception through live video and spatial audio.",
  "ドローンを球として用いる、ロービジョンの人も参加できるバドミントン。": "Badminton using a drone as the shuttlecock, designed for players with low vision.",
  "最優秀賞": "Grand Prize",
  "— 第29回学生CGコンテスト インタラクション部門 / Low Vision Boxing": "— 29th Campus Genius Contest, Interaction Division / Low Vision Boxing",
  "準グランプリ": "Runner-up",
  "優秀賞": "Excellence Award",
  "— NYAA 2024 ゲーム＆インタラクション部門 / HIFU Embossment": "— NYAA 2024, Game & Interaction Division / HIFU Embossment",
  "アクセンチュア インタラクティブ賞": "Accenture Interactive Award",
  "— 第27回学生CGコンテスト / Drone Badminton": "— 27th Campus Genius Contest / Drone Badminton",
  "情報学群長表彰": "Dean's Award, School of Informatics",
  "— 筑波大学": "— University of Tsukuba",
  "ファイナリスト": "Finalist",
  "ノミネート": "Nominee",
  "— 第23回学生CGコンテスト / Spring-Pen": "— 23rd Campus Genius Contest / Spring-Pen",
  "日本学術振興会 特別研究員 DC2": "JSPS Research Fellow (DC2)",
  "日本科学未来館 非常勤研究員": "Part-time Researcher, Miraikan",
  "企業での勤務": "Industry experience",
  "筑波大学 学部授業「メディアアート」ティーチングアシスタント": "Teaching Assistant for the undergraduate course “Media Art,” University of Tsukuba",
  "担当教員：落合陽一": "Instructor: Yoichi Ochiai",
  "筑波大学大学院 情報学学位プログラム 博士後期課程": "Ph.D. program in Informatics, University of Tsukuba",
  "筑波大学大学院 情報学学位プログラム 博士前期課程": "Master's program in Informatics, University of Tsukuba",
  "筑波大学 情報メディア創成学類": "College of Media Arts, Science and Technology, University of Tsukuba",
  "280万円": "JPY 2,800,000",
  "2年間": "2 years",
  "第30回JRPS研究助成 ライオンズ賞 ↗": "30th JRPS Research Grant, Lions Award ↗",
  "「生成AIを活用したロービジョン者の運動時空間認知支援基盤の構築」": "“Support for Movement and Spatiotemporal Awareness of People with Low Vision Using Generative AI”",
  "ユニベール財団 研究助成": "Univers Foundation Research Grant",
  "「視覚障害者の科学館・博物館鑑賞におけるガラス越し展示物の探索支援」": "Support for Exploring Exhibits Behind Glass in Museums and Science Centers for Visitors with Visual Impairments",
  "80万円": "JPY 800,000",
  "つくばマラソン「マラソンを科学する」支援事業 ↗": "Tsukuba Marathon Science Support Program ↗",
  "「AI による視覚障碍者ランナーの景色共有を科学する」": "“Investigating AI-Based Scenery Sharing for Runners with Visual Impairments”",
  "20万円": "JPY 200,000",
  "つくばスマートシティ社会実装トライアル支援事業 ↗": "Tsukuba Smart City Social Implementation Trial Support Program ↗",
  "「視覚障害者も楽しめる光るキックボクシング」": "“Illuminated Kickboxing Accessible to People with Visual Impairments”",
  "メンバー：筒井彩華、田中賢吾、Zhao Yinan": "Members: Ayaka Tsutsui, Kengo Tanaka, Zhao Yinan",
  "AI for Science (SPReAD) 第2回": "AI for Science (SPReAD), second call",
  "「視覚障害者の書道学習に向けた運筆Physical AI基盤の構築」": "“Developing a Brushstroke Physical AI Platform for Calligraphy Learning by People with Visual Impairments”",
  "300万円": "JPY 3,000,000",
  "令和7年度 第2回 サイバーメディスン研究センター 若手研究支援プログラム": "FY2025, second call, Cyber-Medicine Research Center Young Researcher Support Program",
  "「人工知能を用いた産後女性のメンタルヘルス支援に向けた表情・音声指標の探索的検討」": "Exploratory Study of Facial and Vocal Indicators for AI-Based Mental Health Support for Postpartum Women",
  "メンバー：三浦 幸恵、筒井彩華、田中賢吾": "Members: Yukie Miura, Ayaka Tsutsui, Kengo Tanaka",
  "100万円": "JPY 1,000,000",
  "2025年度・2年間": "FY2025, 2 years",
  "世界網膜の日2026 受賞講演 ↗": "Award lecture, World Retina Day 2026 ↗",
  "筑波大学 情報学学位プログラム説明会 学生スピーカー": "Student speaker, Informatics program information session, University of Tsukuba",
  "SIGGRAPH 2023 Birds of a Feather on GenAI — NVIDIA 社主催": "SIGGRAPH 2023 Birds of a Feather on GenAI — hosted by NVIDIA",
  "「ちがい」×AI ～さわって、ためして、研究者とはなそう！ — Low Vision Kick Boxing 展示 ↗": "Difference × AI: Touch, Try, and Talk with Researchers — Low Vision Kick Boxing exhibition ↗",
  "さわれる絵をつくって伝え合おう！ — 日本科学未来館 ↗": "Create and Share Tactile Pictures — Miraikan ↗",
  "チャレスポ！TOKYO — パラ×テクノロジー体感展「Low Vision Boxing」招待ブース展示 ↗": "Challespo! TOKYO — invited Low Vision Boxing exhibit at Para × Technology Experience ↗",
  "主催：東京都・東京都障害者スポーツ協会": "Organized by Tokyo Metropolitan Government and Tokyo Sports Association for the Disabled",
  "東京タワー スポーツチャレンジ2024 — Low Vision Boxing ↗": "Tokyo Tower Sports Challenge 2024 — Low Vision Boxing ↗",
  "主催：NPO日本未来基金": "Organized by Japan Future Foundation (NPO)",
  "【ゼロワン】世界初！視覚障がい者のためのキックボクシング試合が開催　グローブにLED — 東スポWEB ↗": "World-first kickboxing match for visually impaired athletes, with LED gloves — Tokyo Sports Web ↗",
  "【め #38】弱視者のスポーツアクセシビリティの拡大「Low Vision Boxing」 ↗": "Me #38: Expanding sports accessibility for people with low vision — Low Vision Boxing ↗"
};

const altEnglish = {
  "田中賢吾のポートレート": "Portrait of Kengo Tanaka",
  "VRヘッドセットと音声ガイダンスを使い、手を対象へ伸ばす様子": "A person wearing a VR headset and reaching toward a target with auditory guidance",
  "手で卓上ヒューマノイドロボットに触れ、動きを確認する様子": "A hand touching the tabletop humanoid robot to explore its movement",
  "手で3Dプリントされた身体ポーズの触覚模型に触れている様子": "Hands exploring a 3D-printed tactile model of a body pose",
  "回転台に置かれた、踊りのポーズを示す複数の3Dプリント模型": "3D-printed dance poses arranged on a rotating table",
  "青紫色の装置から桜の触覚グラフィックスを印刷した紙が出てくる様子": "A sheet with tactile cherry blossom graphics emerging from a purple embossing machine",
  "発光する装具を着けて向かい合う二人のボクサー": "Two boxers facing each other while wearing illuminated equipment",
  "「HI」の文字が写る透明なアクリル板と超音波加工装置": "Transparent acrylic sheet showing the letters HI beside the ultrasonic embossing setup",
  "触覚グラフィックスを印刷した絵本に手で触れている様子": "Hands exploring a picture book printed with tactile graphics",
  "タブレットで披露宴の映像を見る新郎": "A groom viewing the wedding reception on a tablet",
  "リング状のラケットの中央を飛ぶドローン": "A drone flying through a ring-shaped racket"
};

const translatableNodes = [];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
let node;
while ((node = walker.nextNode())) {
  const source = node.nodeValue.trim();
  if (!(source in toEnglish) && !(source in toJapanese)) continue;
  translatableNodes.push({
    node,
    source,
    leading: node.nodeValue.match(/^\s*/)[0],
    trailing: node.nodeValue.match(/\s*$/)[0]
  });
}

const images = [...document.querySelectorAll(".project-entry img, .profile-photo, .sidebar-photo")].map((img) => ({ img, alt: img.alt }));
const languageButtons = [...document.querySelectorAll("button[data-language]")];
const themeButtons = [...document.querySelectorAll("button[data-theme]")];
const metaDescription = document.querySelector('meta[name="description"]');
let currentLanguage = "ja";

function readPreference(key) {
  try { return localStorage.getItem(key); } catch (error) { return null; }
}
function savePreference(key, value) {
  try { localStorage.setItem(key, value); } catch (error) { /* Local preview may block storage. */ }
}

function setLanguage(language) {
  currentLanguage = language === "en" ? "en" : "ja";
  document.documentElement.lang = currentLanguage;
  document.documentElement.dataset.language = currentLanguage;
  document.querySelector(".site-name").textContent = currentLanguage === "en" ? "Kengo Tanaka" : "田中賢吾";
  document.querySelectorAll(".person-name").forEach((name) => {
    name.textContent = currentLanguage === "en" ? "Kengo Tanaka" : "田中賢吾";
  });
  for (const item of translatableNodes) {
    const translated = currentLanguage === "en" ? toEnglish[item.source] : toJapanese[item.source];
    item.node.nodeValue = item.leading + (translated || item.source) + item.trailing;
  }
  for (const item of images) {
    item.img.alt = currentLanguage === "en" ? (altEnglish[item.alt] || item.alt) : item.alt;
  }
  document.title = currentLanguage === "en" ? "Kengo Tanaka | Research & Works" : "田中賢吾 | 研究・業績";
  metaDescription.content = currentLanguage === "en"
    ? "Profile, research projects, publications, awards, and CV of Kengo Tanaka."
    : "Kengo Tanakaのプロフィール、研究プロジェクト、論文、経歴、受賞歴。";
  document.querySelector(".site-nav").setAttribute("aria-label", currentLanguage === "en" ? "Main navigation" : "メインナビゲーション");
  const groups = document.querySelectorAll(".header-controls [role='group']");
  groups[0].setAttribute("aria-label", currentLanguage === "en" ? "Language" : "言語");
  groups[1].setAttribute("aria-label", currentLanguage === "en" ? "Color theme" : "表示色");
  for (const button of languageButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.language === currentLanguage));
    button.setAttribute("aria-label", button.dataset.language === "ja"
      ? (currentLanguage === "en" ? "Japanese" : "日本語")
      : (currentLanguage === "en" ? "English" : "英語"));
  }
  for (const button of themeButtons) {
    const light = button.dataset.theme === "light";
    button.setAttribute("aria-label", currentLanguage === "en"
      ? (light ? "Light background" : "Dark background")
      : (light ? "白背景" : "黒背景"));
  }
  document.querySelectorAll(".pub-item > a").forEach((link) => {
    const title = link.closest(".pub-item").querySelector("h4").textContent;
    link.setAttribute("aria-label", currentLanguage === "en"
      ? "Open " + title + " in a new tab"
      : title + "を新しいタブで開く");
  });
  savePreference("kengo-language", currentLanguage);
}

function setTheme(theme) {
  const selected = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = selected;
  for (const button of themeButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.theme === selected));
  }
  savePreference("kengo-theme", selected);
}

languageButtons.forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.language)));
themeButtons.forEach((button) => button.addEventListener("click", () => setTheme(button.dataset.theme)));
const params = new URLSearchParams(location.search);
setLanguage(params.get("lang") || readPreference("kengo-language") || "ja");
setTheme(params.get("theme") || readPreference("kengo-theme") || "light");
