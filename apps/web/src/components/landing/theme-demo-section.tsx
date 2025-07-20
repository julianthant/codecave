import { Sun, Moon, Monitor, Palette, Code, Heart } from "lucide-react";
import { ThemeDropdown } from "../ui/theme-toggle";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

// Color palette data
const colorPalette = [
  { name: "Primary", class: "bg-primary", badge: "Orange" },
  {
    name: "Secondary",
    class: "bg-secondary",
    badge: "Blue",
    variant: "secondary" as const,
  },
  {
    name: "Accent",
    class: "bg-accent",
    badge: "Yellow",
    variant: "outline" as const,
  },
];

// Component features data
const features = [
  { name: "Auto system detection", color: "bg-primary" },
  { name: "Smooth transitions", color: "bg-secondary" },
  { name: "Persistent preferences", color: "bg-accent" },
  {
    name: "Base44-inspired design",
    color: "bg-gradient-to-r from-primary to-secondary",
  },
];

// Theme modes data
const themeModes = [
  {
    icon: Sun,
    name: "Light Mode",
    description: "Clean, bright, and energizing for daytime coding",
    gradient: "from-yellow-200 to-yellow-300",
    iconColor: "text-yellow-800",
  },
  {
    icon: Moon,
    name: "Dark Mode",
    description: "Focused, elegant, and easy on the eyes",
    gradient: "from-blue-600 to-purple-700",
    iconColor: "text-blue-100",
  },
  {
    icon: Monitor,
    name: "System",
    description: "Automatically adapts to your OS preference",
    gradient: "from-primary to-secondary",
    iconColor: "text-white",
  },
];

// Header component
const ThemeDemoHeader = () => (
  <header className="mb-16 text-center">
    <div className="inline-flex justify-center items-center space-x-2 mb-6">
      <Palette className="w-6 h-6 text-primary" />
      <span className="font-mono font-medium text-primary text-sm uppercase tracking-wider">
        Theme System
      </span>
    </div>
    <h2 className="mb-4 font-mono font-bold text-foreground text-4xl md:text-5xl">
      Beautiful in Every Light
    </h2>
    <p className="mx-auto max-w-3xl font-mono text-muted text-xl leading-relaxed">
      Experience our Base44-inspired design that adapts seamlessly between light
      and dark modes
    </p>
  </header>
);

// Theme control component
const ThemeControl = () => (
  <div className="flex justify-center mb-12">
    <div className="bg-surface p-6 border border-border rounded-2xl">
      <div className="flex items-center space-x-4">
        <span className="font-mono font-semibold text-foreground text-sm">
          Switch Theme:
        </span>
        <ThemeDropdown />
      </div>
    </div>
  </div>
);

// Color palette card component
const ColorPaletteCard = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-6">
      <h3 className="flex items-center mb-4 font-mono font-semibold text-foreground text-lg">
        <Palette className="mr-2 w-5 h-5 text-primary" />
        Color Palette
      </h3>
      <div className="space-y-3">
        {colorPalette.map((color) => (
          <div key={color.name} className="flex justify-between items-center">
            <span className="font-mono text-muted text-sm">{color.name}</span>
            <div className="flex items-center space-x-2">
              <div
                className={`w-6 h-6 ${color.class} rounded-full border border-border`}
              />
              <Badge variant={color.variant}>{color.badge}</Badge>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Component preview card
const ComponentPreviewCard = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-6">
      <h3 className="flex items-center mb-4 font-mono font-semibold text-foreground text-lg">
        <Code className="mr-2 w-5 h-5 text-primary" />
        Components
      </h3>
      <div className="space-y-4">
        <button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 px-4 py-2 rounded-lg w-full font-mono text-white text-sm transition-opacity">
          Primary Button
        </button>
        <div className="bg-surface-variant p-3 border border-border rounded-lg">
          <code className="font-mono text-sm">
            <span className="text-code-keyword">const</span>{" "}
            <span className="text-code-function">theme</span> ={" "}
            <span className="text-code-string">&quot;dynamic&quot;</span>;
          </code>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Light</Badge>
          <Badge variant="secondary">Dark</Badge>
          <Badge variant="outline">System</Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Features card component
const FeaturesCard = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-6">
      <h3 className="flex items-center mb-4 font-mono font-semibold text-foreground text-lg">
        <Heart className="mr-2 w-5 h-5 text-primary" />
        Features
      </h3>
      <div className="space-y-3 text-sm">
        {features.map((feature) => (
          <div key={feature.name} className="flex items-center space-x-3">
            <div className={`w-2 h-2 ${feature.color} rounded-full`} />
            <span className="font-mono text-muted">{feature.name}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Theme comparison component
const ThemeComparison = () => (
  <div className="bg-gradient-to-r from-surface/50 to-surface-variant/50 p-8 border border-border rounded-3xl">
    <div className="mb-8 text-center">
      <h3 className="mb-2 font-mono font-bold text-foreground text-2xl">
        Perfect for Every Developer
      </h3>
      <p className="font-mono text-muted">
        Whether you prefer the clean brightness of light mode or the focused
        depth of dark mode
      </p>
    </div>

    <div className="gap-6 grid md:grid-cols-3">
      {themeModes.map((mode) => {
        const IconComponent = mode.icon;
        return (
          <div key={mode.name} className="space-y-3 text-center">
            <div
              className={`w-16 h-16 bg-gradient-to-br ${mode.gradient} rounded-2xl flex items-center justify-center mx-auto`}
            >
              <IconComponent className={`w-8 h-8 ${mode.iconColor}`} />
            </div>
            <h4 className="font-mono font-semibold text-foreground">
              {mode.name}
            </h4>
            <p className="font-mono text-muted text-sm">{mode.description}</p>
          </div>
        );
      })}
    </div>
  </div>
);

// Main component - now much shorter and more focused
const ThemeDemoSection = () => {
  return (
    <section className="bg-gradient-to-br from-surface via-background to-surface-variant py-24">
      <div className="mx-auto px-6 max-w-7xl container">
        <ThemeDemoHeader />
        <ThemeControl />

        {/* Demo Grid */}
        <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <ColorPaletteCard />
          <ComponentPreviewCard />
          <FeaturesCard />
        </div>

        <ThemeComparison />
      </div>
    </section>
  );
};

export default ThemeDemoSection;
