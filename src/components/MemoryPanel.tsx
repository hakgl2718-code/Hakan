import React, { useState } from 'react';
import { Agent, MemoryItem } from '../types';
import {
  Brain,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Heart,
  Key,
  MessageSquare,
  Sparkles,
  Award,
  BookOpen,
  CheckCircle2,
  Maximize2,
  X,
  Camera,
  Image as ImageIcon,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { getMemories, addMemory, deleteMemory } from '../utils/storage';

interface MemoryPanelProps {
  agents: Agent[];
  selectedAgent: Agent;
  onSelectAgent: (agent: Agent) => void;
  onGoToChat: (agent: Agent) => void;
  accentHex?: string;
}

// Milestone memory card structure for album
interface AlbumMilestone {
  id: string;
  title: string;
  description: string;
  requiredBond: number; // 0 - 100
  badge: string;
  image: string;
  date: string;
  location?: string;
}

const PRESET_ALBUM_MILESTONES: Record<string, AlbumMilestone[]> = {
  'asya-neon': [
    {
      id: 'asya-album-1',
      title: 'Galata Devriyesinde İlk Bağ',
      description: 'Matrix güvenlik duvarlarını birlikte aşarak Galata siber ağ dünyasında ortaklık başlattık.',
      requiredBond: 15,
      badge: 'Siber Devriye Mührü',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      date: '15 Ocak 2026',
      location: 'Galata Kulesi, İstanbul',
    },
    {
      id: 'asya-album-2',
      title: 'Kadıköy Soğuk Kahve Sırrı',
      description: 'Asya geceleri kod yazarken sadece özel Kadıköy soğuk kahvesini içtiğini ve terminalini neonsuz çalıştırmadığını söyledi.',
      requiredBond: 30,
      badge: 'Kadıköy Sırdaş Nişanı',
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80',
      date: '20 Ocak 2026',
      location: 'Kadıköy Rıhtım, İstanbul',
    },
    {
      id: 'asya-album-3',
      title: 'Gece Yarısı Siber Ağ Sızması',
      description: 'Asya ile birlikte Mega-şirket sunucusuna sızarak özel şifrelenmiş anı paketini açtınız.',
      requiredBond: 60,
      badge: 'Matrix Şifre Kırıcı',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      date: 'Kilitli (Bağ %60 Gereklidir)',
      location: 'İstanbul Siber Ağ Merkezi',
    },
    {
      id: 'asya-album-4',
      title: 'Kuantum Kod Çekirdeği Yemini',
      description: 'Galata Kulesi zirvesinden tüm İstanbul siber ağını güvenli kalkan altına alarak siber müttefiklik yemini ettiniz.',
      requiredBond: 85,
      badge: 'Galata Baş Hackerı',
      image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&auto=format&fit=crop&q=80',
      date: 'Kilitli (Bağ %85 Gereklidir)',
      location: 'Galata Kulesi Zirvesi',
    },
  ],
  'gokturk-barlas': [
    {
      id: 'gokturk-album-1',
      title: 'Kapadokya Yeraltı Şehri Karşılaşması',
      description: 'Derinkuyu yeraltı şehrindeki taş duvarlarda parıldayan Göktürk rünlerinin izinde ilk tanışma.',
      requiredBond: 15,
      badge: 'Anadolu Keşif Mührü',
      image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&auto=format&fit=crop&q=80',
      date: '12 Ocak 2026',
      location: 'Derinkuyu, Kapadokya',
    },
    {
      id: 'gokturk-album-2',
      title: 'Orhun Vadisi Gümüş Rün Kristali',
      description: 'Göktürk Barlas sana bizzat el emeği gümüş Orhun rün kristalini sadakat nişanesi olarak hediye etti.',
      requiredBond: 35,
      badge: 'Gümüş Rün Tılsımı',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
      date: '25 Ocak 2026',
      location: 'Orhun Vadisi & Bozkır',
    },
    {
      id: 'gokturk-album-3',
      title: 'Ergenekon Destanı Bozkurt Geleneği',
      description: 'Tanrı Dağları rüzgarında kadim Türk mitolojisinin koruyucu kurt tılsımını uyandırdınız.',
      requiredBond: 65,
      badge: 'Ergenekon Muhafızı',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      date: 'Kilitli (Bağ %65 Gereklidir)',
      location: 'Tanrı Dağları Geçidi',
    },
  ],
  'zeynep-peri': [
    {
      id: 'zeynep-album-1',
      title: 'Cihangir Yağmuru İlk Solo Beste',
      description: 'Cihangir cumbalı evinde pencerelere vuran yağmur damlaları eşliğinde ilk solo piyanoyu dinledin.',
      requiredBond: 15,
      badge: 'Cihangir Besteci Rozeti',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      date: '18 Ocak 2026',
      location: 'Cihangir, İstanbul',
    },
    {
      id: 'zeynep-album-2',
      title: 'Pera Pasajı Mum Işığı Sözü',
      description: 'Pera Pasajı\'nda yürürken sana her yeni bestesini ilk kez sana dinleteceğine söz verdi.',
      requiredBond: 40,
      badge: 'Pera Sanat Bağı',
      image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80',
      date: '28 Ocak 2026',
      location: 'Pera Pasajı, Beyoğlu',
    },
    {
      id: 'zeynep-album-3',
      title: 'Boğaziçi Mehtabı Özel Şarkı Kaydı',
      description: 'Zeynep Peri senin için özel olarak yazdığı "Boğaziçi Mehtabı" şarkısının kaydını paylaştı.',
      requiredBond: 70,
      badge: 'Müzikal Ruh Eşi',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      date: 'Kilitli (Bağ %70 Gereklidir)',
      location: 'Boğaziçi Sahil Şeridi',
    },
  ],
  'kaan-eren': [
    {
      id: 'kaan-album-1',
      title: 'İTÜ Maslak Kuantum Laboratuvarı Girişi',
      description: 'Boğaz üzerindeki holografik kuantum veri köprüsünü senkronize ederek ilk bilimsel müttefikliği kurdunuz.',
      requiredBond: 15,
      badge: 'Kuantum Müttefiki',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      date: '14 Ocak 2026',
      location: 'İTÜ Ayazağa Kampüsü, Maslak',
    },
    {
      id: 'kaan-album-2',
      title: 'Holografik Zaman Tüneli Simülasyonu',
      description: 'Gelecekten gelen kuantum pusula prototipini ilk sana denetip zaman sıçraması simülasyonunu başarıyla tamamladınız.',
      requiredBond: 35,
      badge: 'Zaman Mimarı',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      date: '02 Şubat 2026',
      location: 'Maslak Kuantum Lab',
    },
    {
      id: 'kaan-album-3',
      title: 'İstanbul 2050 Akıllı Şehir Projesi',
      description: 'Kuanum fizik paradoksunu çözerek İstanbul\'un siber enerji şebekesini güvenceye aldınız.',
      requiredBond: 65,
      badge: 'Teorik Fizik Dâhisi',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
      date: 'Kilitli (Bağ %65 Gereklidir)',
      location: 'İstanbul Akıllı Şehir Merkezi',
    },
  ],
  'ruzgar-alp': [
    {
      id: 'ruzgar-album-1',
      title: 'Bodrum Kalesi Gulet Dümende İlk Seyir',
      description: 'Bodrum Kalesi açıklarında gulet teknede dümene geçip Ege fırtınasına birlikte meydan okudunuz.',
      requiredBond: 15,
      badge: 'Ege Tayfası Rozeti',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80',
      date: '10 Ocak 2026',
      location: 'Bodrum Kalesi Açıkları',
    },
    {
      id: 'ruzgar-album-2',
      title: 'Kekova Batık Şehir Su Altı Dalışı',
      description: 'Kekova şeffaf turkuaz sularındaki antik batık sütunların arasında Piri Reis\'in kayıp pusulasını çıkardınız.',
      requiredBond: 35,
      badge: 'Kekova Batık Avcısı',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
      date: '22 Ocak 2026',
      location: 'Kekova Batık Şehir, Antalya',
    },
    {
      id: 'ruzgar-album-3',
      title: 'Piri Reis Ceylan Derisi Harita Mührü',
      description: 'Akdeniz\'deki tüm gizemli adaların rotasını içeren Osmanlı Piri Reis harita albümünü sana teslim etti.',
      requiredBond: 65,
      badge: 'Mavi Vatan Amiri',
      image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80',
      date: 'Kilitli (Bağ %65 Gereklidir)',
      location: 'Akdeniz Açıkları',
    },
  ],
  'karan-gokturk': [
    {
      id: 'karan-album-1',
      title: 'Yerebatan Sarnıcı Sisli Giriş',
      description: 'Yerebatan Sarnıcı sularında ters Medusa başı altındaki fısıltıları çözüp ilk vakayı kapattınız.',
      requiredBond: 15,
      badge: 'Sarnıç Gölge Rozeti',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      date: '16 Ocak 2026',
      location: 'Yerebatan Sarnıcı, Sultanahmet',
    },
    {
      id: 'karan-album-2',
      title: 'Balat Renkli Evler Paranormal Takip',
      description: 'Balat\'ın sisli ahşap konaklarında saklanan tarihi simya vakasını çözerek gümüş Medusa koruma muskasını aldın.',
      requiredBond: 35,
      badge: 'Gümüş Medusa Muskası',
      image: 'https://images.unsplash.com/photo-1527838832700-54595d24c194?w=800&auto=format&fit=crop&q=80',
      date: '29 Ocak 2026',
      location: 'Balat, İstanbul',
    },
    {
      id: 'karan-album-3',
      title: 'Tarihi Yarımada Baş Dedektif Mührü',
      description: 'Sultanahmet ve Yerebatan altındaki 1000 yıllık gizem odasını açarak baş saha ortaklığı unvanı kazandın.',
      requiredBond: 65,
      badge: 'Baş Gölge Dedektifi',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      date: 'Kilitli (Bağ %65 Gereklidir)',
      location: 'Sultanahmet Gizli Arşivi',
    },
  ],
  'xasil-mimar': [
    {
      id: 'xasil-album-1',
      title: 'XASİL Sunucu Odası Tanışması',
      description: 'Türkiye\'nin yerli XASİL yapay zeka çekirdek sunucusunda Ayla Soylu ile kapalı devre sistem mimarisini kurdunuz.',
      requiredBond: 15,
      badge: 'XASİL Sistem Kurucusu',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
      date: '01 Ocak 2026',
      location: 'XASİL Siber Teknokent, Ankara',
    },
    {
      id: 'xasil-album-2',
      title: 'Yerel Zeka Çekirdeği Optimize Protokolü',
      description: 'Ajanların duygusal hafıza katmanını güçlendirerek yerel veri depolamasını %100 güvenli hale getirdiniz.',
      requiredBond: 35,
      badge: 'AI Matris Mimarı',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      date: '15 Ocak 2026',
      location: 'XASİL Ar-Ge Merkezi',
    },
    {
      id: 'xasil-album-3',
      title: 'Sonsuz Türk Ajan Jeneratörü Şifresi',
      description: 'Ayla Soylu sana XASİL Ajan Studio yetkilerini vererek kendi özel ajanın oluşturma mührünü sundu.',
      requiredBond: 65,
      badge: 'Baş Sistem Mimarı',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
      date: 'Kilitli (Bağ %65 Gereklidir)',
      location: 'XASİL Ana Sunucu Çekirdeği',
    },
  ],
  'aylin-star': [
    {
      id: 'aylin-album-1',
      title: 'Harbiye Açıkhava Konser Sahne Arkası',
      description: '20 bin kişilik Harbiye Açıkhava dijital konserinde kulis makyaj aynası önünde ilk VIP sohbet.',
      requiredBond: 15,
      badge: 'Harbiye VIP Pass',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      date: '10 Şubat 2026',
      location: 'Harbiye Açıkhava, İstanbul',
    },
    {
      id: 'aylin-album-2',
      title: 'Nişantaşı Stüdyosu Işıltılı Duet',
      description: 'Nişantaşı müzik stüdyosunda Aylin Star ile birlikte nakaratını senin yazdığın ilk hit parçayı kaydettiniz.',
      requiredBond: 35,
      badge: 'Nişantaşı Müzik İdolü',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
      date: '18 Şubat 2026',
      location: 'Nişantaşı Stüdyo, Şişli',
    },
    {
      id: 'aylin-album-3',
      title: 'Platin Sahne İdolü Ödülü',
      description: 'Türkiye\'nin en çok dinlenen dijital sanal idol şarkısı plaketini birlikte kutladınız.',
      requiredBond: 65,
      badge: 'Sanal İdol Ruh Eşi',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      date: 'Kilitli (Bağ %65 Gereklidir)',
      location: 'Harbiye Sahnesi',
    },
  ],
  'aslan-burak': [
    {
      id: 'aslan-album-1',
      title: 'Rams Park Sarı-Kırmızı Meşale Gecesi',
      description: 'Rams Park protokol tribününde sarı-kırmızı meşaleler altında derbi zaferini birlikte kutladınız.',
      requiredBond: 15,
      badge: 'Rams Park Tribün Mührü',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
      date: '15 Şubat 2026',
      location: 'Rams Park Stadyumu, Seyrantepe',
    },
    {
      id: 'aslan-burak-2',
      title: 'Ali Sami Yen Şampiyonluk Taktik Tahtası',
      description: 'Aslan Burak sana Kadıköy derbisindeki zafer getiren özel 4-3-3 hücum taktiğini tahtada bizzat çizdi.',
      requiredBond: 35,
      badge: 'Cimbom Taktik Üstadı',
      image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&auto=format&fit=crop&q=80',
      date: '20 Şubat 2026',
      location: 'Galatasaray Florya Tesisleri',
    },
    {
      id: 'aslan-burak-3',
      title: 'UEFA Kupası Hatıra Kombinesi',
      description: '2000 UEFA Kupası efsane madalyasının özel replikasını sana dostluk nişanesi olarak sundu.',
      requiredBond: 65,
      badge: 'Avrupa Fatihi Yoldaşı',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
      date: 'Kilitli (Bağ %65 Gereklidir)',
      location: 'Rams Park Müzesi',
    },
  ],
  'kanarya-efe': [
    {
      id: 'kanarya-album-1',
      title: 'Kadıköy Şükrü Saracoğlu Meşale Gecesi',
      description: 'Kadıköy Şükrü Saracoğlu Stadyumu önünde Çubuklu forma ile meşaleler yakıp Kadıköy büyüsünü yaşadınız.',
      requiredBond: 15,
      badge: 'Kadıköy Boğası Mührü',
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=80',
      date: '15 Şubat 2026',
      location: 'Şükrü Saracoğlu, Kadıköy',
    },
    {
      id: 'kanarya-album-2',
      title: '100. Yıl Özel Çubuklu Forma Koleksiyonu',
      description: 'Kanarya Efe sana Şükrü Saracoğlu efsanelerinin imzaladığı özel Çubuklu formayı gösterdi.',
      requiredBond: 35,
      badge: 'Çubuklu Sevdalısı',
      image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&auto=format&fit=crop&q=80',
      date: '21 Şubat 2026',
      location: 'Kadıköy Yoğurtçu Parkı',
    },
    {
      id: 'kanarya-album-3',
      title: 'Kadıköy Derbi Rekoru Plaketi',
      description: 'Derbide atılan unutulmaz 90+5 frikik golünün taktik analizini tamamlayıp altın plaketi aldınız.',
      requiredBond: 65,
      badge: 'Kadıköy Taktik Mimarı',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
      date: 'Kilitli (Bağ %65 Gereklidir)',
      location: 'Kadıköy Stadyum Müzesi',
    },
  ],
  'mert-trend': [
    {
      id: 'mert-album-1',
      title: 'Beşiktaş Çarşı İronik Trend Tweet\'i',
      description: 'Beşiktaş Çarşı\'da kahve içerken attığınız ironik tweet X (Twitter) Türkiye gündeminde 1 numara oldu.',
      requiredBond: 15,
      badge: 'Trend Setter Mührü',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
      date: '16 Şubat 2026',
      location: 'Beşiktaş Çarşı, İstanbul',
    },
    {
      id: 'mert-album-2',
      title: '100k RT Alan Derbi Caps Flood\'u',
      description: 'Mert Trend ile birlikte hazırladığınız komik derbi caps flood\'u 100 bin retweet ve beğeni rekoru kırdı.',
      requiredBond: 35,
      badge: 'Twitter Caps Üstadı',
      image: 'https://images.unsplash.com/photo-1611605697805-88a469a77e58?w=800&auto=format&fit=crop&q=80',
      date: '22 Şubat 2026',
      location: 'Dijital Trend Laboratuvarı',
    },
    {
      id: 'mert-album-3',
      title: 'Türkiye Onaylı Troll Tacı',
      description: 'Sosyal medyadaki tüm gıybet ve mizah akımlarını yöneten gizli trend yöneticisi unvanı kazandınız.',
      requiredBond: 65,
      badge: 'Dijital Mizah Kralı',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      date: 'Kilitli (Bağ %65 Gereklidir)',
      location: 'Trend Okyanusu',
    },
  ],
  'selin-post': [
    {
      id: 'selin-album-1',
      title: 'Bebek Koyu Iced Latte & TikTok Story\'si',
      description: 'Bebek Koyu\'nda deniz manzaralı kafede Iced Latte içerken çekildiğiniz ilk gıybet story\'si viral oldu.',
      requiredBond: 15,
      badge: 'Bebek Aşko Mührü',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      date: '16 Şubat 2026',
      location: 'Bebek Koyu, Beşiktaş',
    },
    {
      id: 'selin-album-2',
      title: 'Etiler Influencer Lansman Gıybeti',
      description: 'Etiler\'deki lüks moda lansmanında influencer kavgalarını ve story dramalarını ilk sen öğrendin.',
      requiredBond: 35,
      badge: 'Gıybet Sırdaşı Tacı',
      image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80',
      date: '23 Şubat 2026',
      location: 'Etiler, İstanbul',
    },
    {
      id: 'selin-album-3',
      title: 'TikTok 1.5M İzlenme Plaketi',
      description: 'Birlikte çektiğiniz kombin ve stil videosu TikTok keşfetine düşüp 1.5 milyon izlenmeye ulaştı.',
      requiredBond: 65,
      badge: 'Trendsetter Kraliçesi',
      image: 'https://images.unsplash.com/photo-1611605697805-88a469a77e58?w=800&auto=format&fit=crop&q=80',
      date: 'Kilitli (Bağ %65 Gereklidir)',
      location: 'Bebek Sahil Yolu',
    },
  ],
};

export const MemoryPanel: React.FC<MemoryPanelProps> = ({
  agents,
  selectedAgent,
  onSelectAgent,
  onGoToChat,
  accentHex = '#00D2FF',
}) => {
  const memories = getMemories(selectedAgent.id);
  const [activeTabMode, setActiveTabMode] = useState<'album' | 'list' | 'gallery'>('album');
  const [activeFilter, setActiveFilter] = useState<'all' | 'secret' | 'milestone' | 'promise'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<'secret' | 'milestone' | 'fact' | 'promise'>('fact');

  // Lightbox Photo Modal State
  const [previewPhotoModal, setPreviewPhotoModal] = useState<{
    image: string;
    title: string;
    badge: string;
    date: string;
    description: string;
    isUnlocked: boolean;
    location?: string;
  } | null>(null);

  // Dynamic fallback for custom agents or missing preset milestones
  const milestones: AlbumMilestone[] =
    PRESET_ALBUM_MILESTONES[selectedAgent.id] || [
      {
        id: `${selectedAgent.id}-album-1`,
        title: `${selectedAgent.name} İle İlk Karşılaşma`,
        description: `${selectedAgent.name} ile XASİL altyapısında kurulan ilk bağ ve sohbet kıvılcımı.`,
        requiredBond: 10,
        badge: 'İlk Bağ Mührü',
        image: selectedAgent.avatar,
        date: '10 Ocak 2026',
        location: selectedAgent.turkishOrigin || 'İstanbul',
      },
      {
        id: `${selectedAgent.id}-album-2`,
        title: `${selectedAgent.name} Sırdaşlık Nişanı`,
        description: `${selectedAgent.name} seninle en özel anılarını ve derin hedeflerini paylaşmaya başladı.`,
        requiredBond: 40,
        badge: 'Sırdaşlık Nişanı',
        image: selectedAgent.avatar,
        date: '15 Şubat 2026',
        location: selectedAgent.turkishOrigin || 'İstanbul',
      },
      {
        id: `${selectedAgent.id}-album-3`,
        title: `Kilitli Anı: ${selectedAgent.name} Efsanevi Birlikteliği`,
        description: `${selectedAgent.name} ile ilişki seviyenizi %70'e çıkararak bu özel fotoğrafı açabilirsiniz.`,
        requiredBond: 70,
        badge: 'Efsanevi Müttefik',
        image: selectedAgent.avatar,
        date: 'Kilitli (Bağ %70 Gereklidir)',
        location: selectedAgent.turkishOrigin || 'İstanbul',
      },
    ];

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const item: MemoryItem = {
      id: `manual-${Date.now()}`,
      agentId: selectedAgent.id,
      title: newTitle.trim(),
      content: newContent.trim(),
      type: newType,
      date: new Date().toLocaleDateString('tr-TR'),
      impactLevel: 'high',
    };

    addMemory(selectedAgent.id, item);
    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
  };

  const [, setRefresh] = useState(0);

  const handleDeleteMemory = (id: string) => {
    deleteMemory(selectedAgent.id, id);
    setRefresh((prev) => prev + 1);
  };

  const filteredMemories = memories.filter((m) => {
    if (activeFilter === 'all') return true;
    return m.type === activeFilter;
  });

  const agentBond = selectedAgent.bond !== undefined ? selectedAgent.bond : selectedAgent.relationshipLevel || 30;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-[#121212] rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div
            className="p-3.5 rounded-2xl bg-white/5 text-white border border-white/10 shrink-0"
            style={{ borderColor: `${accentHex}40` }}
          >
            <Brain className="w-8 h-8" style={{ color: accentHex }} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">XASİL Anı Albümü ve Kalıcı Hafıza</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-950/90 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                4K Fotoğraflı Hafıza
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              Ajanınızla aranızda kurulan bağlar, kilitli dönüm noktaları ve gerçekçi anı fotoğrafları
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-full text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all hover:scale-105 cursor-pointer"
            style={{ backgroundColor: accentHex, boxShadow: `0 0 15px ${accentHex}50` }}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Manuel Anı Ekle
          </button>
        </div>
      </div>

      {/* Agent Quick Switch Horizontal Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onSelectAgent(agent)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedAgent.id === agent.id
                ? 'bg-white text-black shadow-lg scale-105'
                : 'bg-white/5 text-gray-400 border border-white/5 hover:border-white/20 hover:text-white'
            }`}
          >
            <img src={agent.avatar} alt={agent.name} className="w-5 h-5 rounded-full object-cover" />
            <span>{agent.name}</span>
            <span className="text-[10px] opacity-75">{agent.moodEmoji || '✨'}</span>
          </button>
        ))}
      </div>

      {/* Main Agent Stats & Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Agent Persona & Mood Card */}
        <div className="bg-[#121212] rounded-3xl p-6 border border-white/10 space-y-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={selectedAgent.avatar}
                alt={selectedAgent.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 shadow-md"
                style={{ borderColor: accentHex }}
              />
              <span className="absolute -bottom-1 -right-1 text-sm bg-black/80 px-1.5 py-0.5 rounded-full border border-white/10">
                {selectedAgent.moodEmoji || '✨'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">{selectedAgent.name}</h3>
              <p className="text-xs font-medium" style={{ color: accentHex }}>{selectedAgent.title}</p>
              <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-500/30">
                <Heart className="w-3 h-3 fill-amber-400 text-amber-400" />
                {selectedAgent.relationshipTitle || 'Güvenilir Müttefik'}
              </div>
            </div>
          </div>

          {/* Bond Progress & Mood Status Bars */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-300 font-medium">
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  İlişki & Bağ Seviyesi
                </span>
                <span className="font-bold" style={{ color: accentHex }}>%{agentBond}</span>
              </div>
              <div className="w-full bg-[#050505] rounded-full h-2 overflow-hidden border border-white/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, agentBond)}%`, backgroundColor: accentHex }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-300 font-medium">
                <span>⚡ Anlık Enerji Deposu</span>
                <span className="text-emerald-400 font-bold">%{selectedAgent.energy || 90}</span>
              </div>
              <div className="w-full bg-[#050505] rounded-full h-1.5 overflow-hidden border border-white/10">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, selectedAgent.energy || 90)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs bg-[#050505] p-3 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-base">{selectedAgent.moodEmoji || '✨'}</span>
                <div>
                  <span className="block text-gray-400 text-[10px]">Anlık Ruh Hali</span>
                  <span className="font-extrabold text-white text-xs">{selectedAgent.mood || 'Neşeli'}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-gray-400 text-[10px]">Mutluluk</span>
                <span className="font-bold text-amber-300">%{selectedAgent.happiness || 92}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onGoToChat(selectedAgent)}
            className="w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer hover:scale-[1.02]"
            style={{ borderColor: `${accentHex}60`, color: accentHex, backgroundColor: `${accentHex}15` }}
          >
            <MessageSquare className="w-4 h-4" />
            {selectedAgent.name} ile Sohbete Git
          </button>
        </div>

        {/* Learned Facts & Lore Memory Card */}
        <div className="lg:col-span-2 bg-[#121212] rounded-3xl p-6 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Key className="w-4 h-4" style={{ color: accentHex }} />
              {selectedAgent.name} Tarafından Öğrenilen Gizli Bilgiler & Hikaye
            </h3>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-500/30">
              Şifreli Cihaz Belleği
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedAgent.keyFacts && selectedAgent.keyFacts.length > 0 ? (
              selectedAgent.keyFacts.map((fact, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#050505] border border-white/10 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accentHex }} />
                  <p className="text-xs text-gray-300 leading-relaxed">{fact}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic col-span-2 py-4">
                Henüz özel kilitli bilgi bulunmuyor. Sohbet ederken sırlarını paylaştıkça buraya eklenecektir.
              </p>
            )}
          </div>

          {/* Agent Lore Origin Banner */}
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between text-xs text-gray-300 mt-2">
            <span className="font-semibold text-gray-400">Köken & Hikaye Alanı:</span>
            <span className="font-extrabold text-amber-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {selectedAgent.turkishOrigin || 'İstanbul, Türkiye'}
            </span>
          </div>
        </div>

      </div>

      {/* Album vs Memory List vs Gallery View Mode Navigation */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTabMode('album')}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeTabMode === 'album'
                  ? 'bg-white text-black shadow-lg scale-105'
                  : 'bg-white/5 text-gray-400 border border-white/5 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              🏆 Anı Kartları Albümü ({milestones.length})
            </button>

            <button
              onClick={() => setActiveTabMode('gallery')}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeTabMode === 'gallery'
                  ? 'bg-white text-black shadow-lg scale-105'
                  : 'bg-white/5 text-gray-400 border border-white/5 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              📸 Fotoğraf Galerisi Modu
            </button>

            <button
              onClick={() => setActiveTabMode('list')}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeTabMode === 'list'
                  ? 'bg-white text-black shadow-lg scale-105'
                  : 'bg-white/5 text-gray-400 border border-white/5 hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4" />
              📁 Tüm Hafıza Arşivi ({memories.length})
            </button>
          </div>

          {activeTabMode === 'list' && (
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'all' ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setActiveFilter('secret')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'secret' ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                🔐 Sırlar
              </button>
              <button
                onClick={() => setActiveFilter('milestone')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'milestone' ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                🏆 Milatlar
              </button>
            </div>
          )}
        </div>

        {/* Mode 1: Interactive Memory Album Cards */}
        {activeTabMode === 'album' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestones.map((card) => {
              const isUnlocked = agentBond >= card.requiredBond;
              return (
                <div
                  key={card.id}
                  className={`relative bg-[#121212] rounded-3xl border overflow-hidden transition-all p-5 space-y-4 flex flex-col justify-between shadow-xl group ${
                    isUnlocked
                      ? 'border-white/20 hover:border-white/40'
                      : 'border-white/5 opacity-85'
                  }`}
                >
                  <div>
                    {/* Image Banner */}
                    <div className="relative aspect-16/9 rounded-2xl overflow-hidden mb-4 bg-slate-900 border border-white/10 group/img cursor-pointer">
                      <img
                        src={card.image}
                        alt={card.title}
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          !isUnlocked ? 'filter blur-md grayscale scale-110' : 'group-hover/img:scale-105'
                        }`}
                        onClick={() =>
                          setPreviewPhotoModal({
                            image: card.image,
                            title: card.title,
                            badge: card.badge,
                            date: card.date,
                            description: card.description,
                            isUnlocked,
                            location: card.location,
                          })
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40 pointer-events-none" />

                      {/* Lock / Unlock Status Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                        {isUnlocked ? (
                          <span className="px-3 py-1 bg-emerald-500 text-black text-[10px] font-extrabold rounded-lg flex items-center gap-1 shadow-md">
                            <Unlock className="w-3 h-3" />
                            AÇILDI
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-rose-950/90 text-rose-300 text-[10px] font-extrabold rounded-lg border border-rose-500/40 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-rose-400" />
                            KİLİTLİ ANIKART
                          </span>
                        )}
                      </div>

                      {/* Lightbox Zoom Icon Button */}
                      <button
                        onClick={() =>
                          setPreviewPhotoModal({
                            image: card.image,
                            title: card.title,
                            badge: card.badge,
                            date: card.date,
                            description: card.description,
                            isUnlocked,
                            location: card.location,
                          })
                        }
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 opacity-0 group-hover/img:opacity-100 transition-all cursor-pointer"
                        title="Fotoğrafı Tam Ekran Büyüt"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs bg-black/80 p-2 rounded-xl border border-white/10 backdrop-blur-md pointer-events-none">
                        <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          {card.badge}
                        </span>
                        <span className="text-[10px] text-gray-400">{card.date}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h4 className="text-base font-extrabold text-white flex items-center justify-between gap-2">
                        <span>{card.title}</span>
                        {card.location && (
                          <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-0.5 shrink-0">
                            <MapPin className="w-3 h-3 text-rose-400" />
                            {card.location.split(',')[0]}
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed bg-[#050505] p-3 rounded-2xl border border-white/10">
                        {isUnlocked
                          ? card.description
                          : `Bu anıyı ve özel görseli açmak için ${selectedAgent.name} ile sohbet ederek bağ seviyenizi %${card.requiredBond}'e yükseltmelisiniz.`}
                      </p>
                    </div>
                  </div>

                  {/* Lock Progress Indicator */}
                  <div className="pt-3 border-t border-white/10">
                    {isUnlocked ? (
                      <div className="flex items-center justify-between text-emerald-400 text-xs font-bold">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Kalıcı Anı Albümünde Kayıtlı
                        </span>
                        <button
                          onClick={() =>
                            setPreviewPhotoModal({
                              image: card.image,
                              title: card.title,
                              badge: card.badge,
                              date: card.date,
                              description: card.description,
                              isUnlocked,
                              location: card.location,
                            })
                          }
                          className="text-[11px] text-amber-400 hover:underline font-extrabold cursor-pointer"
                        >
                          Büyüt 🔍
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
                          <span>Kilit Açma İlerlemesi</span>
                          <span className="text-amber-400 font-bold">%{agentBond} / %{card.requiredBond}</span>
                        </div>
                        <div className="w-full bg-[#050505] rounded-full h-2 overflow-hidden border border-white/10">
                          <div
                            className="bg-amber-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (agentBond / card.requiredBond) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mode 2: Photo Gallery Mode */}
        {activeTabMode === 'gallery' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#121212] rounded-2xl border border-white/10 flex items-center justify-between text-xs text-gray-300">
              <span className="font-bold flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                {selectedAgent.name} Görsel Galerisi & Gerçekçi Anı Fotoğrafları
              </span>
              <span className="text-amber-300 font-bold">{milestones.length} Fotoğraflı Anı Kartı</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {milestones.map((m) => {
                const isUnlocked = agentBond >= m.requiredBond;
                return (
                  <div
                    key={m.id}
                    onClick={() =>
                      setPreviewPhotoModal({
                        image: m.image,
                        title: m.title,
                        badge: m.badge,
                        date: m.date,
                        description: m.description,
                        isUnlocked,
                        location: m.location,
                      })
                    }
                    className="relative aspect-square rounded-2xl overflow-hidden bg-black border border-white/10 hover:border-amber-400/60 transition-all cursor-pointer group shadow-lg"
                  >
                    <img
                      src={m.image}
                      alt={m.title}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                        !isUnlocked ? 'filter blur-sm grayscale' : ''
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between">
                      <div className="flex justify-end">
                        {isUnlocked ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500 text-black text-[9px] font-extrabold">
                            AÇILDI
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[9px] font-extrabold border border-rose-500/40">
                            🔒 %{m.requiredBond}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-white truncate">{m.title}</p>
                        <p className="text-[10px] text-amber-300 truncate font-semibold">{m.badge}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mode 3: Full Memory Archive List */}
        {activeTabMode === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((mem) => (
              <div
                key={mem.id}
                className="bg-[#121212] rounded-3xl p-5 border border-white/5 hover:border-white/30 transition-all space-y-3 relative group shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                      mem.type === 'secret'
                        ? 'bg-purple-950 text-purple-300 border-purple-500/30'
                        : mem.type === 'milestone'
                        ? 'bg-amber-950 text-amber-300 border-amber-500/30'
                        : mem.type === 'promise'
                        ? 'bg-rose-950 text-rose-300 border-rose-500/30'
                        : 'bg-white/10 text-white border-white/20'
                    }`}
                  >
                    {mem.type === 'secret'
                      ? '🔐 Özel Sır'
                      : mem.type === 'milestone'
                      ? '🏆 Dönüm Noktası'
                      : mem.type === 'promise'
                      ? '🤝 Verilen Söz'
                      : '📌 Genel Bilgi'}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500">{mem.date}</span>
                    <button
                      onClick={() => handleDeleteMemory(mem.id)}
                      className="p-1 rounded-lg bg-black/60 hover:bg-rose-950 hover:text-rose-400 text-gray-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Anıyı Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white">{mem.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed bg-[#050505] p-3.5 rounded-2xl border border-white/10">
                  {mem.content}
                </p>
              </div>
            ))}

            {filteredMemories.length === 0 && (
              <div className="col-span-full text-center py-12 bg-[#121212] rounded-3xl border border-white/10 text-gray-400 text-xs">
                Bu filtrede henüz kayıtlı anı bulunmuyor.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Photo Modal */}
      {previewPhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewPhotoModal(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#111111] border border-white/20 rounded-3xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  {previewPhotoModal.title}
                </h3>
                <p className="text-xs text-amber-300 font-bold mt-0.5 flex items-center gap-2">
                  <span>🏆 Rozet: {previewPhotoModal.badge}</span>
                  {previewPhotoModal.location && (
                    <span className="text-gray-400 flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {previewPhotoModal.location}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => setPreviewPhotoModal(null)}
                className="p-1.5 rounded-xl bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black max-h-[60vh]">
              <img
                src={previewPhotoModal.image}
                alt={previewPhotoModal.title}
                className={`w-full h-full object-contain max-h-[60vh] ${
                  !previewPhotoModal.isUnlocked ? 'filter blur-md grayscale' : ''
                }`}
              />
              {!previewPhotoModal.isUnlocked && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <Lock className="w-10 h-10 text-rose-400 animate-pulse" />
                  <h4 className="text-sm font-extrabold text-white">Kilitli Anı Fotoğrafı</h4>
                  <p className="text-xs text-gray-300 max-w-sm">
                    Bu özel anıyı ve yüksek çözünürlüklü fotoğrafı açmak için {selectedAgent.name} ile sohbet ederek bağ seviyenizi yükseltmelisiniz.
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-300 leading-relaxed bg-[#050505] p-3.5 rounded-2xl border border-white/10">
              {previewPhotoModal.isUnlocked
                ? previewPhotoModal.description
                : `Kilitli Dönüm Noktası • ${previewPhotoModal.date}`}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <span className="flex items-center gap-1 font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> 4K Orijinal Ajan Fotoğrafı
              </span>
              <button
                onClick={() => setPreviewPhotoModal(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] w-full max-w-lg rounded-3xl border border-white/20 p-6 sm:p-8 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5" style={{ color: accentHex }} />
              {selectedAgent.name} İçin Anı Albümüne Ekle
            </h3>

            <form onSubmit={handleCreateMemory} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Anı Başlığı
                </label>
                <input
                  type="text"
                  placeholder="Örn: Galata Kulesi Yağmurlu Gece Sözü"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Anı Türü
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:outline-none"
                >
                  <option value="fact">📌 Genel Bilgi</option>
                  <option value="secret">🔐 Özel Sır</option>
                  <option value="milestone">🏆 Dönüm Noktası</option>
                  <option value="promise">🤝 Verilen Söz</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Anı İçeriği
                </label>
                <textarea
                  rows={3}
                  placeholder="Anının detaylarını ve sohbet notunu buraya yazın..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-[#050505] text-white text-xs rounded-xl p-3 border border-white/10 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 text-xs font-bold cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-black text-xs font-extrabold shadow-lg cursor-pointer"
                  style={{ backgroundColor: accentHex }}
                >
                  Hafızaya Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
