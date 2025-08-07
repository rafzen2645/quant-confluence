import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Brain, Zap, Shield } from "lucide-react";

export const Header = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/30 rounded-full">
          <Brain className="w-6 h-6 text-primary" />
          <span className="text-primary font-bold">Quotex AI Predictor</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          High-Confidence Candle Prediction
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload your chart screenshot 30 seconds before expiry for instant AI-powered analysis
        </p>

        {/* Status Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <Badge variant="secondary" className="bg-trading-bull/20 text-trading-bull border-trading-bull/30">
            <Zap className="w-3 h-3 mr-1" />
            &lt;15s Response
          </Badge>
          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
            <TrendingUp className="w-3 h-3 mr-1" />
            4-Confluence Analysis
          </Badge>
          <Badge variant="secondary" className="bg-accent/40 text-accent-foreground border-accent">
            <Shield className="w-3 h-3 mr-1" />
            High Accuracy
          </Badge>
        </div>
      </div>

      {/* Analysis Method */}
      <Card className="bg-gradient-card border-border/50 shadow-trading">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4 text-center">4-Confluence Analysis Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">1</span>
              </div>
              <h4 className="font-medium">📊 Pattern</h4>
              <p className="text-xs text-muted-foreground">Strong candle formations</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">2</span>
              </div>
              <h4 className="font-medium">🧱 Zone</h4>
              <p className="text-xs text-muted-foreground">Support/Resistance levels</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">3</span>
              </div>
              <h4 className="font-medium">📈 Trend</h4>
              <p className="text-xs text-muted-foreground">Market direction context</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">4</span>
              </div>
              <h4 className="font-medium">⚡ Momentum</h4>
              <p className="text-xs text-muted-foreground">Force & timing analysis</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};