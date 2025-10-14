export const translations = {
  en: {
    // Header
    appTitle: "Dropshipping Helper",
    
    // Tabs
    analyzeProduct: "Analyze Product",
    results: "Results",
    
    // Product Input
    uploadImage: "Upload Product Image",
    orEnterName: "or enter product name",
    productNamePlaceholder: "Enter product name...",
    analyzeButton: "Analyze Product",
    analyzing: "Analyzing...",
    dragDrop: "Drag & drop an image here",
    clickToSelect: "or click to select a file",
    dropHere: "Drop the image here",
    
    // Features
    features: {
      productId: "Product Identification",
      productIdDesc: "AI-powered image recognition",
      priceComp: "Price Comparison",
      priceCompDesc: "Real-time market analysis",
      supplierVerify: "Supplier Verification",
      supplierVerifyDesc: "Scam detection & ratings",
      shippingCalc: "Shipping Calculator",
      shippingCalcDesc: "Customs & delivery estimates",
      reviewAnalysis: "Review Analysis",
      reviewAnalysisDesc: "Fake review detection",
      seoOptimization: "SEO Optimization",
      seoOptimizationDesc: "AI-generated descriptions",
    },
    
    // Product Analysis Display
    exportPDF: "Export PDF",
    exportCSV: "Export CSV",
    productImage: "Product Image",
    productOverview: "Product Overview",
    description: "Description",
    keyFeatures: "Key Features",
    specifications: "Specifications",
    priceRange: "Price Range",
    average: "Average",
    estimatedPrice: "Estimated Price",
    affiliateLinks: "Affiliate Links",
    supplierOptions: "Supplier Options",
    platform: "Platform",
    price: "Price",
    shippingTime: "Shipping Time",
    rating: "Rating",
    reviews: "Reviews",
    viewSupplier: "View Supplier",
    
    // Additional Tools
    additionalTools: "Additional Analysis Tools",
    comparePrice: "Compare Prices",
    verifySupplier: "Verify Supplier",
    calcShipping: "Calculate Shipping",
    analyzeReviews: "Analyze Reviews",
    generateSEO: "Generate SEO",
    analyzeCompetitors: "Analyze Competitors",
    
    // Messages
    uploadSuccess: "Product analyzed successfully!",
    uploadError: "Failed to analyze product. Please try again.",
    copySuccess: "Copied to clipboard!",
    exportPDFSuccess: "PDF exported successfully!",
    exportCSVSuccess: "CSV exported successfully!",
  },
  
  cn: {
    // Header
    appTitle: "代发货助手",
    
    // Tabs
    analyzeProduct: "分析产品",
    results: "结果",
    
    // Product Input
    uploadImage: "上传产品图片",
    orEnterName: "或输入产品名称",
    productNamePlaceholder: "输入产品名称...",
    analyzeButton: "分析产品",
    analyzing: "分析中...",
    dragDrop: "将图片拖放到此处",
    clickToSelect: "或点击选择文件",
    dropHere: "在此处放置图片",
    
    // Features
    features: {
      productId: "产品识别",
      productIdDesc: "AI驱动的图像识别",
      priceComp: "价格比较",
      priceCompDesc: "实时市场分析",
      supplierVerify: "供应商验证",
      supplierVerifyDesc: "诈骗检测和评级",
      shippingCalc: "运费计算",
      shippingCalcDesc: "海关和配送估算",
      reviewAnalysis: "评论分析",
      reviewAnalysisDesc: "虚假评论检测",
      seoOptimization: "SEO优化",
      seoOptimizationDesc: "AI生成描述",
    },
    
    // Product Analysis Display
    exportPDF: "导出PDF",
    exportCSV: "导出CSV",
    productImage: "产品图片",
    productOverview: "产品概述",
    description: "描述",
    keyFeatures: "主要特点",
    specifications: "规格",
    priceRange: "价格范围",
    average: "平均",
    estimatedPrice: "预估价格",
    affiliateLinks: "联盟链接",
    supplierOptions: "供应商选项",
    platform: "平台",
    price: "价格",
    shippingTime: "发货时间",
    rating: "评分",
    reviews: "评论",
    viewSupplier: "查看供应商",
    
    // Additional Tools
    additionalTools: "其他分析工具",
    comparePrice: "比较价格",
    verifySupplier: "验证供应商",
    calcShipping: "计算运费",
    analyzeReviews: "分析评论",
    generateSEO: "生成SEO",
    analyzeCompetitors: "分析竞争对手",
    
    // Messages
    uploadSuccess: "产品分析成功！",
    uploadError: "产品分析失败。请重试。",
    copySuccess: "已复制到剪贴板！",
    exportPDFSuccess: "PDF导出成功！",
    exportCSVSuccess: "CSV导出成功！",
  }
};

export type Language = 'en' | 'cn';
export type TranslationKey = typeof translations.en;
