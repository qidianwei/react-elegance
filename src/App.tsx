import React from 'react';
import './App.css';
import styles from './App.module.css';
import { 
  ParallaxScroll, 
  MagneticButton, 
  ProductShowcase,
  FadeInView,
  SlideInSection,
  StickyScroll,
  Hero,
  ProductCard,
  NavigationBar,
  ScrollFadeIn
} from './components';
import ParticleWave from './components/ParticleWave';

function App() {
  // Navigation links
  const navLinks = [
    { text: '首页', url: '#' },
    { text: '产品特点', url: '#content' },
    { text: '卡片展示', url: '#products' },
    { text: '视差效果', url: '#parallax' },
    { text: '联系我们', url: '#contact' }
  ];

  return (
    <div className={`${styles.appContainer} App`}>
      <NavigationBar links={navLinks} isSticky={true} />
      
      <div className={styles.particleWrapper}>
        <ParticleWave />
        <Hero 
          imageSrc=""
          title="动效演示平台"
          subtitle="探索React中令人惊叹的动画和交互效果"
          ctaText="开始探索"
          ctaLink="#content"
          isParallax={true}
        />
      </div>
      <div id="content" className={styles.contentWrapper}>
        <section className="section">
          <ScrollFadeIn direction="up" duration={1} delay={0.2}>
            <h2>渐入效果</h2>
            <p>随着页面滚动，元素平滑地淡入显示，带来舒适的视觉体验</p>
          </ScrollFadeIn>
          
          <div className="demo-grid">
            <ScrollFadeIn direction="up" delay={0.4} triggerOnce>
              <div className="demo-box">
                <h3>向上滑入</h3>
                <p>元素从下方滑入</p>
              </div>
            </ScrollFadeIn>
            
            <ScrollFadeIn direction="down" delay={0.6} triggerOnce>
              <div className="demo-box">
                <h3>向下滑入</h3>
                <p>元素从上方滑入</p>
              </div>
            </ScrollFadeIn>
            
            <ScrollFadeIn direction="left" delay={0.8} triggerOnce>
              <div className="demo-box">
                <h3>从左滑入</h3>
                <p>元素从右向左滑入</p>
              </div>
            </ScrollFadeIn>
            
            <ScrollFadeIn direction="right" delay={1.0} triggerOnce>
              <div className="demo-box">
                <h3>从右滑入</h3>
                <p>元素从左向右滑入</p>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        <section id="products" className="section">
          <ScrollFadeIn direction="up" triggerOnce>
            <h2>产品卡片展示</h2>
          </ScrollFadeIn>
          
          <div className="product-card-grid">
            <ScrollFadeIn direction="up" delay={0.2} triggerOnce>
              <ProductCard 
                imageSrc="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                title="无线耳机"
                description="高品质音频体验，舒适的佩戴感，长久的电池续航，让你随时随地享受音乐。"
                ctaText="了解更多"
                ctaLink="#"
              />
            </ScrollFadeIn>
            
            <ScrollFadeIn direction="up" delay={0.4} triggerOnce>
              <ProductCard 
                imageSrc="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                title="智能手表"
                description="跟踪你的健康数据，接收通知，管理日程安排，全天候的助手。"
                ctaText="立即购买"
                ctaLink="#"
              />
            </ScrollFadeIn>
            
            <ScrollFadeIn direction="up" delay={0.6} triggerOnce>
              <ProductCard 
                imageSrc="https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                title="智能音箱"
                description="语音控制，智能家居集成，高清音质，改变你的居家生活方式。"
                ctaText="查看详情"
                ctaLink="#"
              />
            </ScrollFadeIn>
          </div>
        </section>

        <StickyScroll 
          startColor="#121212" 
          endColor="#0071e3"
          height="250vh"
          stickyPosition={25}
        >
          <div className="sticky-section-content">
            <h2>粘性滚动与渐变</h2>
            <p>内容保持在视口中固定位置，背景随滚动渐变变化</p>
            <div className="gradient-showcase">
              <div className="gradient-circle"></div>
              <div className="gradient-circle"></div>
              <div className="gradient-circle"></div>
            </div>
          </div>
        </StickyScroll>

        <section id="parallax" className="section dark parallax-section">
          <ScrollFadeIn direction="none" triggerOnce>
            <h2>视差滚动效果</h2>
            <p>不同元素以不同速度移动，创造出深度感</p>
          </ScrollFadeIn>
          
          <div className="parallax-row">
            <ParallaxScroll speed={-0.3}>
              <ScrollFadeIn direction="left" delay={0.2} triggerOnce>
                <div className="parallax-item">
                  <h3>背景层</h3>
                  <p>滚动速度最慢</p>
                  <div className="parallax-visual"></div>
                </div>
              </ScrollFadeIn>
            </ParallaxScroll>
            
            <ParallaxScroll speed={-0.8}>
              <ScrollFadeIn direction="left" delay={0.4} triggerOnce>
                <div className="parallax-item">
                  <h3>中间层</h3>
                  <p>滚动速度适中</p>
                  <div className="parallax-visual"></div>
                </div>
              </ScrollFadeIn>
            </ParallaxScroll>
            
            <ParallaxScroll speed={-1.5}>
              <ScrollFadeIn direction="left" delay={0.6} triggerOnce>
                <div className="parallax-item">
                  <h3>前景层</h3>
                  <p>滚动速度最快</p>
                  <div className="parallax-visual"></div>
                </div>
              </ScrollFadeIn>
            </ParallaxScroll>
          </div>
        </section>

        <section className="section">
          <div className="product-section">
            <SlideInSection direction="right">
              <h2>从右侧滑入</h2>
              <p>元素从屏幕右侧平滑滑入视图</p>
            </SlideInSection>
            
            <SlideInSection direction="left" delay={300}>
              <div className="product-image-placeholder"></div>
            </SlideInSection>
          </div>
        </section>

        <section className="section dark">
          <ProductShowcase>
            <div className="product-box">
              <h2>产品展示</h2>
              <p>跟随滚动或鼠标移动，产品展示角度随之改变</p>
              <div className="product-model"></div>
            </div>
          </ProductShowcase>
        </section>

        <footer id="contact">
          <ScrollFadeIn direction="up" triggerOnce>
            <p>使用React和纯CSS/JS实现的苹果风格动效</p>
            <MagneticButton>
              <span>联系我们</span>
            </MagneticButton>
          </ScrollFadeIn>
        </footer>
      </div>
    </div>
  );
}

export default App;
