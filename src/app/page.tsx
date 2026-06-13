"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { InputNumber } from "@/components/ui/input-number";
import {
  InputOTPMethod,
  METHOD_AUTH,
} from "@/components/ui/input-otp-method";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { InputPassword } from "@/components/ui/input-password";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useSyncExternalStore } from "react";
import { toast } from "sonner";
import styles from "./page.module.scss";

type Theme = "light" | "dark";

const THEME_CHANGE_EVENT = "spybee-theme-change";
const THEME_TRANSITION_CLASS = "theme-transition";
const THEME_TRANSITION_DURATION = 300;

function getThemeSnapshot(): Theme {
  const savedTheme = window.localStorage.getItem("theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  const root = document.documentElement;

  if (root.classList.contains("light")) {
    return "light";
  }

  if (root.classList.contains("dark")) {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export default function Home() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    root.classList.add(THEME_TRANSITION_CLASS);
    root.classList.remove("light", "dark");
    root.classList.add(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));

    window.setTimeout(() => {
      root.classList.remove(THEME_TRANSITION_CLASS);
    }, THEME_TRANSITION_DURATION);
  };

  return (
    <TooltipProvider>
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.heroTop}>
            <Badge variant="outline">Spybee design system</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              aria-pressed={theme === "dark"}
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </Button>
          </div>
          <h1>UI component preview</h1>
          <p>
            Interactive examples for the reusable components adapted from
            shadcn to Radix UI and SCSS Modules.
          </p>
        </header>

        <div className={styles.grid}>
          <Card>
            <CardHeader>
              <CardTitle>Alert Dialog</CardTitle>
              <CardDescription>
                Confirm irreversible actions before applying them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete incident</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogMedia aria-hidden="true">!</AlertDialogMedia>
                    <AlertDialogTitle>
                      Delete this incident?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The incident and its media
                      will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive">
                      Delete incident
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avatar and Badge</CardTitle>
              <CardDescription>
                Represent project members and incident states.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.stack}>
              <div className={styles.inline}>
                <Avatar size="lg">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Project administrator"
                  />
                  <AvatarFallback>JL</AvatarFallback>
                  <AvatarBadge title="Online" />
                </Avatar>
                <AvatarGroup aria-label="Incident participants">
                  <Avatar><AvatarFallback>AL</AvatarFallback></Avatar>
                  <Avatar><AvatarFallback>MR</AvatarFallback></Avatar>
                  <Avatar><AvatarFallback>CS</AvatarFallback></Avatar>
                  <AvatarGroupCount>+3</AvatarGroupCount>
                </AvatarGroup>
              </div>
              <div className={styles.inline}>
                <Badge>Open</Badge>
                <Badge variant="secondary">On pause</Badge>
                <Badge variant="destructive">High priority</Badge>
                <Badge variant="outline">Pending approval</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dialog, Sheet and Popover</CardTitle>
              <CardDescription>
                Overlay surfaces for focused tasks and secondary information.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.inline}>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit incident</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit incident</DialogTitle>
                    <DialogDescription>
                      Update the title and description of the selected incident.
                    </DialogDescription>
                  </DialogHeader>
                  <div className={styles.form}>
                    <Label htmlFor="dialog-title">Title</Label>
                    <Input id="dialog-title" defaultValue="Water leak" />
                    <Label htmlFor="dialog-description">Description</Label>
                    <Textarea
                      id="dialog-description"
                      defaultValue="Leak detected on the second floor."
                    />
                  </div>
                  <DialogFooter showCloseButton>
                    <Button>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open filters</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Incident filters</SheetTitle>
                    <SheetDescription>
                      Refine the incidents displayed on the map.
                    </SheetDescription>
                  </SheetHeader>
                  <div className={styles.sheetBody}>
                    <Label htmlFor="sheet-project">Project</Label>
                    <Select defaultValue="tower">
                      <SelectTrigger id="sheet-project">
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="tower">North Tower</SelectItem>
                          <SelectItem value="mall">Central Mall</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <SheetFooter>
                    <Button>Apply filters</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Incident info</Button>
                </PopoverTrigger>
                <PopoverContent className={styles.popoverContent}>
                  <strong>INC-1042</strong>
                  <p>Created today by Julian Lozano.</p>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form controls</CardTitle>
              <CardDescription>
                Inputs for incident details, credentials and numeric values.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.form}>
              <Label htmlFor="incident-name">Incident title</Label>
              <Input id="incident-name" placeholder="Enter a title" />

              <Label htmlFor="incident-password">Password</Label>
              <InputPassword
                id="incident-password"
                placeholder="Enter your password"
              />

              <Label htmlFor="incident-notes">Notes</Label>
              <Textarea
                id="incident-notes"
                placeholder="Add additional context"
              />

              <Label>Estimated workers</Label>
              <InputNumber defaultValue={4} minValue={1} maxValue={20} />

              <Label htmlFor="incident-url">Project URL</Label>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput id="incident-url" placeholder="project.spybee.io" />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton>Copy</InputGroupButton>
                </InputGroupAddon>
              </InputGroup>

              <Label htmlFor="incident-summary">Summary</Label>
              <InputGroup>
                <InputGroupTextarea
                  id="incident-summary"
                  placeholder="Describe the incident"
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText>0 / 240 characters</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select and Separator</CardTitle>
              <CardDescription>
                Structured choices and visual grouping.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.stack}>
              <Select defaultValue="open">
                <SelectTrigger className={styles.fullWidth}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Incident status</SelectLabel>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="pause">On pause</SelectItem>
                    <SelectSeparator />
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Separator />
              <div className={styles.inline}>
                <Badge variant="secondary">12 open</Badge>
                <Badge variant="outline">5 closed</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-factor authentication</CardTitle>
              <CardDescription>
                OTP inputs for TOTP and backup-code verification.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.stack}>
              <div className={styles.otpBlock}>
                <Label>Short verification code</Label>
                <InputOTP maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className={styles.otpBlock}>
                <Label>TOTP method</Label>
                <InputOTPMethod method={METHOD_AUTH.TOTP} />
              </div>
              <div className={styles.otpBlock}>
                <Label>Backup code</Label>
                <InputOTPMethod
                  method={METHOD_AUTH.BACKUP}
                  showSeparator={false}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Switch, Toggle and Toggle Group</CardTitle>
              <CardDescription>
                Boolean settings and compact option groups.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.stack}>
              <div className={styles.setting}>
                <div>
                  <Label htmlFor="notifications">Email notifications</Label>
                  <p>Receive incident status changes.</p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
              <Separator />
              <div className={styles.inline}>
                <Toggle aria-label="Toggle map labels">Map labels</Toggle>
                <Toggle variant="outline" aria-label="Toggle heatmap">
                  Heatmap
                </Toggle>
              </div>
              <ToggleGroup
                type="single"
                defaultValue="map"
                variant="outline"
                aria-label="Dashboard view"
              >
                <ToggleGroupItem value="map">Map</ToggleGroupItem>
                <ToggleGroupItem value="list">List</ToggleGroupItem>
                <ToggleGroupItem value="chart">Chart</ToggleGroupItem>
              </ToggleGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tooltip and Sonner</CardTitle>
              <CardDescription>
                Contextual guidance and non-blocking feedback.
              </CardDescription>
              <CardAction>
                <Badge variant="secondary">Feedback</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className={styles.inline}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover for details</Button>
                </TooltipTrigger>
                <TooltipContent>
                  Incidents are visible to all project members.
                </TooltipContent>
              </Tooltip>
              <Button
                onClick={() =>
                  toast.success("Incident created", {
                    description: "The marker is now visible on the map.",
                  })
                }
              >
                Show toast
              </Button>
            </CardContent>
            <CardFooter>
              <p className={styles.hint}>
                Sonner notifications render through the global toaster.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Toaster position="bottom-right" theme={theme} richColors />
    </TooltipProvider>
  );
}
