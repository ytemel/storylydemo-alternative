import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Save, Settings as SettingsIcon, Users, Code, Link } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    companyName: "Acme Corp",
    domain: "acmecorp.com",
    autoSave: true,
    aiPersonalization: true,
    notifications: true,
    apiKey: "sk-1234567890abcdef...",
    webhookUrl: "https://api.acmecorp.com/webhook",
  });

  const handleSave = () => {
    // Mock save functionality
    toast({
      title: "Settings saved successfully",
      description: "Your preferences have been updated.",
    });
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Configure your account and preferences</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center space-x-2">
              <SettingsIcon className="w-4 h-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center space-x-2">
              <Link className="w-4 h-4" />
              <span>Integrations</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Team</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center space-x-2">
              <Code className="w-4 h-4" />
              <span>API</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={settings.companyName}
                      onChange={(e) => handleSettingChange("companyName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      value={settings.domain}
                      onChange={(e) => handleSettingChange("domain", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Default Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="autoSave">Auto-save widgets</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save widget changes
                    </p>
                  </div>
                  <Switch
                    id="autoSave"
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="aiPersonalization">AI personalization</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable AI-powered content personalization by default
                    </p>
                  </div>
                  <Switch
                    id="aiPersonalization"
                    checked={settings.aiPersonalization}
                    onCheckedChange={(checked) => handleSettingChange("aiPersonalization", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="notifications">Email notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important updates
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value={settings.webhookUrl}
                    onChange={(e) => handleSettingChange("webhookUrl", e.target.value)}
                    placeholder="https://your-api.com/webhook"
                  />
                  <p className="text-sm text-muted-foreground">
                    We'll send events to this URL when widgets are interacted with
                  </p>
                </div>
                <Button variant="outline">Test Webhook</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-party Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Google Analytics</h4>
                      <p className="text-sm text-muted-foreground">
                        Track widget performance in Google Analytics
                      </p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Shopify</h4>
                      <p className="text-sm text-muted-foreground">
                        Sync product data and track conversions
                      </p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Zapier</h4>
                      <p className="text-sm text-muted-foreground">
                        Connect with thousands of apps
                      </p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-medium">John Doe</h4>
                        <p className="text-sm text-muted-foreground">john.doe@acmecorp.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Owner</span>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">JS</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Jane Smith</h4>
                        <p className="text-sm text-muted-foreground">jane.smith@acmecorp.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Editor</span>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  <Users className="w-4 h-4 mr-2" />
                  Invite Team Member
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Widget Creation</h4>
                      <p className="text-sm text-muted-foreground">
                        Allow team members to create new widgets
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Recipe Management</h4>
                      <p className="text-sm text-muted-foreground">
                        Allow team members to manage AI recipes
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Analytics Access</h4>
                      <p className="text-sm text-muted-foreground">
                        Allow team members to view analytics
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="apiKey"
                      value={settings.apiKey}
                      onChange={(e) => handleSettingChange("apiKey", e.target.value)}
                      type="password"
                      className="flex-1"
                    />
                    <Button variant="outline">Regenerate</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use this key to authenticate API requests
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <div>
                      <h4 className="font-medium">Requests this month</h4>
                      <p className="text-sm text-muted-foreground">2,847 / 10,000</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">28.5%</div>
                      <div className="text-sm text-muted-foreground">used</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <div>
                      <h4 className="font-medium">Rate limit</h4>
                      <p className="text-sm text-muted-foreground">100 requests per minute</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">12</div>
                      <div className="text-sm text-muted-foreground">current</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Access our comprehensive API documentation to integrate Storyly with your applications.
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Code className="w-4 h-4 mr-2" />
                      View Documentation
                    </Button>
                    <Button variant="outline">Download SDK</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
