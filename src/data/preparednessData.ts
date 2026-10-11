export interface PreparednessCategoryDetail {
  id: string;
  name: string;
  emoji: string;
  badge: string;
  title: string;
  bgImage: string;
  imageAlt: string;
  phases: {
    pre: { step: string; title: string; desc: string; icon: string; highlight?: string }[];
    during: { step: string; title: string; desc: string; icon: string; highlight?: string }[];
    post: { step: string; title: string; desc: string; icon: string; highlight?: string }[];
  };
}

export const PREPAREDNESS_CATEGORIES: PreparednessCategoryDetail[] = [
  {
    id: 'flood',
    name: 'น้ำท่วมฉับพลัน',
    emoji: '🌊',
    badge: 'SURVIVAL PROTOCOL // CAT-01',
    title: 'คู่มือปฏิบัติ: น้ำท่วมฉับพลัน & น้ำป่าไหลหลาก',
    bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtHm_d9p9rO0Cr02t1aUKfIZtTkdiba8UzzeOsX2lx2p7erj62a4j1zUGH5VCh7E_whsu2-_JSYACl1qPjysWZckmu0fq5zHjaF7-msEdD6SQAcFhXNulP94w6aZBlhzcSNPg63FImIPLuUsOsqPz0BVrmtlMrZI6FKxFIyWq8ZL3_6nBIcXVpFY8LVwfrsv_WDs3sKosnJ3XWddXgLuiCptz9RavTa_rQXly6L7Qr2Ge8yJ7uGQKp',
    imageAlt: 'High quality aerial cinematic photo of heavy torrential rainfall and swelling river waters breaching flood defenses in a rural town, moody slate teal and dark emergency navy grading',
    phases: {
      pre: [
        {
          step: 'STEP 01',
          title: 'ตรวจสอบเส้นทางอพยพและจุดรวมพล',
          desc: 'สำรวจจุดรวมพลสูงสุดในละแวกบ้าน ระบุ 2 เส้นทางหลักเลี่ยงคันคลอง ทางลอด และตอม่อสะพาน',
          icon: 'explore',
        },
        {
          step: 'STEP 02',
          title: 'จัดเตรียมกระเป๋ายังชีพ 72 ชม.',
          desc: 'วางไว้ในจุดหยิบง่าย ใกล้ประตูทางออกหลัก ตรวจสอบวันหมดอายุอาหาร ยา และน้ำดื่มสำรอง',
          icon: 'backpack',
        },
        {
          step: 'STEP 03',
          title: 'ยกปลั๊กไฟและย้ายของมีค่าขึ้นที่สูง',
          desc: 'ย้ายเครื่องใช้ไฟฟ้าขึ้นชั้น 2 หรือสูงกว่าระดับน้ำสูงสุดในอดีตอย่างน้อย 1 เมตร เตรียมแนวกระสอบทราย',
          icon: 'vertical_align_top',
        },
        {
          step: 'STEP 04',
          title: 'สำรองน้ำดื่มและยาประจำตัว',
          desc: 'น้ำสะอาดอย่างน้อย 3 ลิตรต่อคนต่อวัน ยารักษาโรคประจำตัว และชุดปฐมพยาบาลในถุงซิปล็อคกันน้ำ',
          icon: 'water_drop',
        },
      ],
      during: [
        {
          step: 'CRITICAL',
          title: 'สับสวิตช์เบรกเกอร์ตัดกระแสไฟหลัก',
          desc: 'ตัดกระแสไฟทันทีก่อนน้ำท่วมถึงปลั๊ก ห้ามสัมผัสสวิตช์ขณะตัวเปียกหรือยืนแช่น้ำเด็ดขาด',
          icon: 'bolt',
          highlight: 'urgent',
        },
        {
          step: 'ACT NOW',
          title: 'อพยพขึ้นสู่ที่สูง (Vertical Evacuation)',
          desc: 'เคลื่อนย้ายเด็ก คนชรา และผู้ป่วยติดเตียงขึ้นชั้นสอง หลีกเลี่ยงห้องใต้หลังคาที่ไม่มีทางออกสู่หลังคา',
          icon: 'arrow_upward',
        },
        {
          step: 'RULE',
          title: 'ห้ามขับรถลุยกระแสน้ำไหลเชี่ยว',
          desc: 'น้ำลึกเพียง 30 ซม. สามารถพัดพารถยนต์ขนาดเล็กให้ลอยได้ หากรถดับให้รีบลงจากรถและหนีขึ้นที่สูง',
          icon: 'no_crash',
        },
        {
          step: 'COMM',
          title: 'เปิดรับสัญญาณเตือนและวิทยุฉุกเฉิน',
          desc: 'ติดตามประกาศจากกรมอุตุนิยมวิทยาและ ปภ. ทางช่องทาง Aegis Alert หรือวิทยุ FM/AM',
          icon: 'radio',
        },
      ],
      post: [
        {
          step: 'CAUTION',
          title: 'ระวังสัตว์มีพิษและกระแสไฟฟ้ารั่ว',
          desc: 'งู ตะขาบ มักหนีน้ำมาหลบซ่อนตามซอกมุม สวมรองเท้าบูทยางหนาทุกครั้งก่อนเดินเหยียบย่ำดินโคลน',
          icon: 'pest_control',
          highlight: 'urgent',
        },
        {
          step: 'INSPECT',
          title: 'ให้ช่างตรวจสอบระบบไฟฟ้าก่อนจ่ายไฟ',
          desc: 'ห้ามเปิดเบรกเกอร์จนกว่าเต้ารับและสายไฟจะแห้งสนิทและผ่านการตรวจเช็กความปลอดภัย',
          icon: 'electrical_services',
        },
        {
          step: 'HEALTH',
          title: 'ระวังโรคฉี่หนูและน้ำปนเปื้อนเชื้อโรค',
          desc: 'หลีกเลี่ยงการสัมผัสน้ำขัง ล้างเท้าด้วยสบู่ทันที ดื่มเฉพาะน้ำต้มสุกหรือน้ำดื่มขวดปิดสนิท',
          icon: 'sanitizer',
        },
      ],
    },
  },
  {
    id: 'quake',
    name: 'แผ่นดินไหว',
    emoji: '🔴',
    badge: 'SURVIVAL PROTOCOL // CAT-02',
    title: 'คู่มือปฏิบัติ: แผ่นดินไหวรุนแรง & อาฟเตอร์ช็อก',
    bgImage: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Interior architectural emergency photography during an earthquake with seismic tremors',
    phases: {
      pre: [
        {
          step: 'STEP 01',
          title: 'ยึดตู้เฟอร์นิเจอร์หนักเข้ากับผนัง',
          desc: 'ใช้อุปกรณ์ L-Bracket ยึดตู้หนังสือ ชั้นวางของ ทีวี และตู้เย็น ไม่ให้ล้มทับเมื่อเกิดแรงสั่นสะเทือน',
          icon: 'handyman',
        },
        {
          step: 'STEP 02',
          title: 'กำหนดจุดปลอดภัยในแต่ละห้อง',
          desc: 'ระบุใต้โต๊ะไม้หนาแข็งแรง ใต้คานโครงสร้าง หรือผนังด้านใน หลีกเลี่ยงหน้าต่างกระจกและโคมไฟห้อย',
          icon: 'roofing',
        },
        {
          step: 'STEP 03',
          title: 'เตรียมรองเท้าหัวแข็งและไฟฉายข้างเตียง',
          desc: 'วางไว้ในจุดที่เอื้อมถึงทันทีในความมืด เพื่อป้องกันเศษแก้วบาดเท้าหลังตื่นนอนกลางดึก',
          icon: 'bedtime',
        },
      ],
      during: [
        {
          step: 'RULE 01',
          title: 'หมอบ กำบัง เกาะ (Drop, Cover, Hold On)',
          desc: 'หมอบลงกับพื้น มุดเข้าใต้โต๊ะที่แข็งแรง ใช้มือหนึ่งจับขาโต๊ะให้แน่น อีกมือปกป้องศีรษะและลำคอ',
          icon: 'front_hand',
          highlight: 'urgent',
        },
        {
          step: 'RULE 02',
          title: 'ห้ามใช้ลิฟต์โดยสารเด็ดขาด',
          desc: 'หากกำลังอยู่ในลิฟต์ ให้กดทุกชั้นเพื่อออกจากลิฟต์ที่ใกล้ที่สุดทันที ใช้บันไดหนีไฟเท่านั้น',
          icon: 'no_transfer',
        },
        {
          step: 'RULE 03',
          title: 'กรณีอยู่นอกอาคาร: ออกห่างจากเสาไฟและป้าย',
          desc: 'ไปอยู่ในที่โล่งแจ้ง หมอบลงต่ำ ระวังกระเบื้องหลังคา ผนังปูน และกระจกตกใส่จากตึกสูง',
          icon: 'domain_disabled',
        },
      ],
      post: [
        {
          step: 'STEP 01',
          title: 'ตรวจการรั่วไหลของก๊าซหุงต้มและประกายไฟ',
          desc: 'ห้ามจุดไม้ขีดหรือไฟแช็กเด็ดขาด หากได้กลิ่นก๊าซให้เปิดประตูระบายแล้วรีบออกจากอาคาร',
          icon: 'mode_heat',
          highlight: 'urgent',
        },
        {
          step: 'STEP 02',
          title: 'เตรียมพร้อมรับมือแผ่นดินไหวตาม (Aftershock)',
          desc: 'มักเกิดซ้ำภายในไม่กี่นาทีหรือหลายวันหลังจากนั้น อย่าเพิ่งกลับเข้าอาคารที่มีรอยแตกร้าวรุนแรง',
          icon: 'waves',
        },
        {
          step: 'STEP 03',
          title: 'ชายฝั่งทะเล: ระวังสึนามิ สังเกตน้ำลดลงผิดปกติ',
          desc: 'หากอยู่ใกล้ทะเลแล้วรู้สึกถึงแผ่นดินไหวนานเกิน 20 วินาที ให้อพยพขึ้นเขาทันทีโดยไม่ต้องรอประกาศ',
          icon: 'tsunami',
        },
      ],
    },
  },
  {
    id: 'volcano',
    name: 'ภูเขาไฟระเบิด',
    emoji: '🌋',
    badge: 'SURVIVAL PROTOCOL // CAT-03',
    title: 'คู่มือปฏิบัติ: เถ้าภูเขาไฟ & ก๊าซพิษกำมะถัน',
    bgImage: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Dramatic wide angle landscape shot of volcanic ash plume towering into dark atmosphere',
    phases: {
      pre: [
        {
          step: 'STEP 01',
          title: 'สำรองหน้ากาก N95 และแว่นตานิรภัยครอบตา',
          desc: 'เถ้าภูเขาไฟมีผลึกซิลิกาคมกริบ การใช้หน้ากากผ้าธรรมดาไม่สามารถกรองอนุภาคขนาดเล็กได้',
          icon: 'masks',
        },
        {
          step: 'STEP 02',
          title: 'ซีลช่องว่างประตูหน้าต่างด้วยเทปกาว',
          desc: 'เตรียมพลาสติกคลุมและเทปผ้าเพื่อปิดรอยต่อกรอบหน้าต่าง ป้องกันเถ้าละเอียดเล็ดลอดเข้าห้อง',
          icon: 'curtains_closed',
        },
      ],
      during: [
        {
          step: 'ACTION',
          title: 'อยู่ภายในอาคารปิด ปิดระบบดูดอากาศภายนอก',
          desc: 'ปิดแอร์ที่มีช่องรับลมภายนอก สวมเสื้อแขนยาว กางเกงขายาว ไม่สวมคอนแทกต์เลนส์เด็ดขาด',
          icon: 'house',
          highlight: 'urgent',
        },
        {
          step: 'DRIVING',
          title: 'หลีกเลี่ยงการขับขี่รถยนต์',
          desc: 'เถ้าภูเขาไฟจะเข้ากรองอากาศและทำลายเครื่องยนต์ทันที อีกทั้งทำให้ถนนลื่นไถลทัศนวิสัยเป็นศูนย์',
          icon: 'car_crash',
        },
      ],
      post: [
        {
          step: 'CLEAN',
          title: 'กวาดเถ้าออกจากหลังคาก่อนพังถล่ม',
          desc: 'เถ้าภูเขาไฟมีความหนาแน่นสูงและจะหนักขึ้น 3 เท่าเมื่อเปียกฝน สวมอุปกรณ์ป้องกันก่อนขึ้นที่สูง',
          icon: 'roofing',
        },
        {
          step: 'WATER',
          title: 'กรองและตรวจสอบน้ำดื่มก่อนบริโภค',
          desc: 'เถ้าอาจปนเปื้อนสารหนูและฟลูออไรด์ ใช้น้ำจากถังปิดสนิทเท่านั้น',
          icon: 'water_bottle',
        },
      ],
    },
  },
  {
    id: 'storm',
    name: 'พายุหมุน & ดินถล่ม',
    emoji: '🌪️',
    badge: 'SURVIVAL PROTOCOL // CAT-04',
    title: 'คู่มือปฏิบัติ: พายุไต้ฝุ่น ลมกระโชกแรง & ดินโคลนถล่ม',
    bgImage: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Dramatic atmospheric storm surge photography with intense gale-force winds',
    phases: {
      pre: [
        {
          step: 'STEP 01',
          title: 'ตัดกิ่งไม้ใหญ่ใกล้หลังคาและสายไฟ',
          desc: 'รื้อถอนป้ายหรือกันสาดที่ไม่มั่นคง ผูกยึดถังเก็บน้ำและจานดาวเทียมให้แน่นหนา',
          icon: 'park',
        },
        {
          step: 'STEP 02',
          title: 'ชุมชนเชิงเขา: สังเกตสัญญาณดินสไลด์',
          desc: 'สังเกตน้ำในลำห้วยเปลี่ยนเป็นสีขุ่นแดง มีเสียงดังคล้ายเครื่องยนต์มาจากภูเขา ให้รีบอพยพทันที',
          icon: 'landslide',
          highlight: 'urgent',
        },
      ],
      during: [
        {
          step: 'SAFETY',
          title: 'หลบอยู่ในห้องตอนในของบ้านชั้นล่าง',
          desc: 'อยู่ห่างจากหน้าต่างกระจก หากกระจกแตก ให้คลุมตัวด้วยผ้านวมหนาใต้โต๊ะ',
          icon: 'shelves',
        },
        {
          step: 'EYE',
          title: 'ระวัง "ตาพายุ" ลมสงบชั่วคราว',
          desc: 'อย่าเพิ่งออกจากที่หลบภัยเพราะลมพายุทิศทางตรงกันข้ามจะพัดกระหน่ำซ้ำอย่างรุนแรงในไม่กี่นาที',
          icon: 'cyclone',
        },
      ],
      post: [
        {
          step: 'CHECK',
          title: 'ระวังสายไฟแรงสูงขาดห้อยแช่น้ำ',
          desc: 'อยู่ห่างจากเสาไฟที่เอียงอย่างน้อย 10 เมตร และแจ้งการไฟฟ้า 1129 หรือกู้ภัย 1784 ทันที',
          icon: 'power_off',
        },
      ],
    },
  },
  {
    id: 'wildfire',
    name: 'ไฟป่า & หมอกควัน',
    emoji: '🔥',
    badge: 'SURVIVAL PROTOCOL // CAT-05',
    title: 'คู่มือปฏิบัติ: ไฟป่าลุกลาม & วิกฤตหมอกควันพิษ PM2.5',
    bgImage: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Dramatic warm ember sparks against dark cool night sky in wildfire',
    phases: {
      pre: [
        {
          step: 'STEP 01',
          title: 'สร้างแนวกันไฟรอบบริเวณบ้าน 10-30 เมตร',
          desc: 'เก็บกวาดใบไม้แห้ง เศษกิ่งไม้รอบตัวบ้าน ฉีดน้ำพรมพื้นที่รอบรั้วเมื่อไฟลุกลามเข้ามาใกล้',
          icon: 'yard',
        },
        {
          step: 'STEP 02',
          title: 'เตรียมห้องปลอดฝุ่น (Clean Room)',
          desc: 'เลือกห้องที่มีช่องเปิดน้อยที่สุด ติดตั้งเครื่องฟอกอากาศแผ่นกรอง True HEPA',
          icon: 'air_purifier',
        },
      ],
      during: [
        {
          step: 'EVACUATE',
          title: 'อพยพทันทีหากลมพัดไฟมุ่งตรงมา',
          desc: 'อย่าพยายามดับไฟด้วยตัวเองหากแนวไฟสูงเกิน 1 เมตร ขับรถเลี่ยงเส้นทางควันหนาแน่น',
          icon: 'run_circle',
          highlight: 'urgent',
        },
      ],
      post: [
        {
          step: 'CHECK',
          title: 'เฝ้าระวังสะเก็ดไฟคุซ้ำ (Spot Fires)',
          desc: 'ตรวจเช็กใต้ชายคาและหลังคาอย่างสม่ำเสมอเป็นเวลา 24 ชม. หลังจากไฟสงบ',
          icon: 'local_fire_department',
        },
      ],
    },
  },
];
