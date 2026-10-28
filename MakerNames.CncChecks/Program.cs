using Clipper2Lib;
using MakerNames.Core.Generators;
using MakerNames.Core.Models;
static void Check(bool ok,string label) { if(!ok)throw new Exception(label); Console.WriteLine("PASS "+label); }
static PathD Rect(double x,double y,double w,double h) => new() {new(x,y),new(x+w,y),new(x+w,y+h),new(x,y+h)};
var generator=new CncGenerator();
var hole=Rect(30,30,40,40);hole.Reverse();
var shape=new PathsD {Rect(0,0,100,100),hole};
var settings=new CncSettings {Width=100,Diameter=4,Depth=5,Passes=3};
var plan=generator.Plan(shape,settings);
Check(plan.Paths.Count==2,"hole preserved");
Check(Math.Abs(plan.Paths[0].Min(p=>p.X)-32)<.01,"hole offset inward by tool radius");
Check(Math.Abs(plan.Paths[1].Min(p=>p.X)+2)<.01,"outer offset outward by tool radius");
Check(plan.Depths.Last()==-5 && plan.Depths.Length==3,"exact final depth and pass count");
Check(!plan.Gcode.Contains("M6") && plan.Gcode.Contains("G21"),"GRBL millimetres and no unsupported tool change");
settings.Controller="mach3";settings.Tool=7;
Check(generator.Plan(shape,settings).Gcode.Contains("T7 M6"),"Mach3 tool selection");
settings.Controller="grbl";
var overlap=generator.Plan(new PathsD {Rect(0,0,100,100),Rect(50,0,100,100)},settings);
Check(overlap.Paths.Count==1,"overlapping objects unioned");
settings.Diameter=50;
var diagnostic=generator.Plan(shape,settings);
Check(!diagnostic.CanExport && diagnostic.Gcode=="" && diagnostic.SimulationGcode.Length>0 && diagnostic.Warning!=null,"inaccessible hole allows diagnostic simulation but blocks export");
settings.Diameter=4;settings.Clockwise=false;settings.Origin="center";settings.Start="right";
var centered=generator.Plan(shape,settings);
Check(Math.Abs(centered.Paths[1].Max(p=>p.X)-52)<.01,"center origin");
Check(centered.Paths[1][0].X==centered.Paths[1].Max(p=>p.X),"right starting point");
foreach(var p in centered.Paths)Check(Clipper.Area(new PathD(p.Select(v=>new PointD(v.X,v.Y))))>0,"counterclockwise orientation");
settings.Depth=-1;
try{generator.Generate(new NameProject(),settings);throw new Exception("missing rejection");}catch(ArgumentException){Console.WriteLine("PASS negative depth rejected");}
var board = new CncSettings {WorkWidth=300,WorkHeight=200,Diameter=4};
var figures = new List<List<CncPoint>> { new() {new(20,30),new(70,30),new(70,60),new(20,60)} };
var figurePlan=generator.Generate(new NameProject(),board,figures,false);
Check(figurePlan.Width==50 && figurePlan.Height==30,"figures retain exact millimetre dimensions");
Check(figurePlan.Outline.SelectMany(p=>p).Min(p=>p.X)==20,"figure position preserved");
board.Origin="center";
var boardCenter=generator.Generate(new NameProject(),board,figures,false);
Check(boardCenter.WorkX==-150 && boardCenter.Outline.SelectMany(p=>p).Min(p=>p.X)==-130,"origin uses work area center");
board.WorkWidth=72;
try{generator.Generate(new NameProject(),board,figures,false);throw new Exception("missing boundary rejection");}catch(ArgumentException){Console.WriteLine("PASS tool swept width outside area rejected");}
board.WorkWidth=300;
figures[0][0]=new(double.NaN,30);
try{generator.Generate(new NameProject(),board,figures,false);throw new Exception("missing invalid figure rejection");}catch(ArgumentException){Console.WriteLine("PASS invalid figure rejected");}
