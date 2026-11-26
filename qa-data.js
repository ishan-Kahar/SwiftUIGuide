// SwiftUI interview — 25 medium level sawal.
// Yahi ek file interview.html (sawal + jawab) aur questions.html (sirf sawal) dono use karte hain.
// Sawal badalna ho to sirf yahan badlo, dono pages khud update ho jaayenge.
window.QA = [
{t:'Basics', q:'SwiftUI mein View ek struct kyun hota hai, class kyun nahi?',
a:'View sirf UI ka <b>description</b> hai, asli screen nahi. Struct halka hota hai aur copy hota hai, isliye SwiftUI isko har state change par bahut sasta bana kar phenk sakta hai. Asli rendering aur state SwiftUI andar alag rakhta hai. Class hoti to reference sharing, retain cycles aur inheritance ka bojh aata.',
k:['Value type, halka, baar-baar banta hai','View = description, render SwiftUI karta hai','State SwiftUI ke storage mein rehti hai, struct mein nahi']},
{t:'Basics', q:'<code>some View</code> ka matlab kya hai? <code>AnyView</code> se kaise alag hai?',
a:'<code>some View</code> ek <b>opaque return type</b> hai: compiler ko asli type pata hai (jaise <code>VStack&lt;TupleView&lt;...&gt;&gt;</code>), bas hum likhte nahi. Isse SwiftUI type ke basis par fast diffing kar pata hai. <code>AnyView</code> type ko mita deta hai (type erasure), jisse SwiftUI ko pata nahi chalta kya badla, aur performance girti hai. Alag-alag view return karne ho to <code>@ViewBuilder</code> ya <code>Group</code> behtar hai.',
c:`@ViewBuilder
func statusView(_ ok: Bool) -> some View {
    if ok { Text("Done") } else { ProgressView() }   // AnyView ki zaroorat nahi
}`,
k:['Opaque type, compiler ko type pata','AnyView = type erasure, diffing mehngi','@ViewBuilder se if/else return']},
{t:'Basics', q:'Modifier order se kya farak padta hai? Example do.',
a:'Har modifier pichhle view ko lapet kar <b>naya view</b> banata hai, isliye order matter karta hai. <code>.padding().background(.red)</code> mein padding ke saath laal area bada hota hai. <code>.background(.red).padding()</code> mein laal sirf content par hota hai, padding bahar khaali rehti hai. Same <code>.frame</code> aur <code>.border</code>, aur tap area ke liye <code>.contentShape</code> par bhi lagta hai.',
c:`Text("A").padding().background(.red)   // laal box bada
Text("B").background(.red).padding()   // laal sirf text par`,
k:['Modifier = naya wrapper view','Order se size aur look badalta hai']},
{t:'State', q:'<code>@State</code> aur <code>@Binding</code> mein kya farak hai?',
a:'<code>@State</code> data ka <b>owner</b> hai: view apna local data rakhta hai aur SwiftUI usko store karta hai. <code>@Binding</code> owner nahi hota: woh kisi aur ke state ka reference hai, jisse child padh bhi sakta hai aur badal bhi sakta hai. Parent <code>$value</code> se binding bhejta hai. <code>@State</code> hamesha <code>private</code> rakhna chahiye.',
c:`struct Parent: View {
    @State private var isOn = false
    var body: some View { Child(isOn: $isOn) }
}
struct Child: View {
    @Binding var isOn: Bool
    var body: some View { Toggle("Light", isOn: $isOn) }
}`,
k:['State = source of truth','Binding = two-way reference','$ se binding banti hai']},
{t:'State', q:'<code>@StateObject</code> aur <code>@ObservedObject</code> mein kya farak hai? Galat use karne par kya bug aata hai?',
a:'<code>@StateObject</code> object ko <b>banata aur own</b> karta hai: view kitni bhi baar dobara bane, object ek hi baar banta hai. <code>@ObservedObject</code> sirf bahar se diya gaya object observe karta hai, own nahi karta. Bug: agar view ke andar <code>@ObservedObject var vm = VM()</code> likha, to parent re-render hone par naya VM ban jaata hai aur data (jaise loaded list) reset ho jaata hai.',
k:['StateObject = owner, ek baar init','ObservedObject = bahar se aaya','Galat use = state reset bug']},
{t:'State', q:'iOS 17 ka <code>@Observable</code> macro <code>ObservableObject</code> se kaise behtar hai?',
a:'<code>@Observable</code> mein <code>@Published</code> likhne ki zaroorat nahi, saari properties khud observe hoti hain. Sabse bada fayda: view <b>sirf wahi property</b> track karta hai jo uske <code>body</code> mein padhi gayi. <code>ObservableObject</code> mein kisi bhi <code>@Published</code> ke badalne par saare observer views dobara bante the. Owner view mein <code>@State</code>, share karne ke liye <code>.environment(obj)</code>, aur binding ke liye <code>@Bindable</code> use hota hai.',
c:`@Observable class CartVM {
    var items: [String] = []
    var coupon = ""
}
struct CartView: View {
    @State private var vm = CartVM()     // owner
    var body: some View { Text("\\(vm.items.count) items") }  // sirf items track
}`,
k:['@Published nahi chahiye','Property-level tracking, kam re-render','@State / @Environment / @Bindable']},
{t:'State', q:'<code>@EnvironmentObject</code> / <code>@Environment</code> kab use karte ho? Isme crash kab hota hai?',
a:'Jab ek object (user session, theme, cart) bahut saari screens ko chahiye, to har init mein pass karne ke bajaye upar <code>.environmentObject(obj)</code> ya <code>.environment(obj)</code> lagate hain, aur neeche koi bhi view use le leta hai. Crash tab hota hai jab koi view object maange par upar kisi ne inject hi na kiya ho. Aksar yeh <code>#Preview</code> ya naye <code>.sheet</code> mein hota hai, isliye wahan bhi inject karna padta hai.',
k:['Dependency ko deep tree mein bhejna','Inject bhoole = runtime crash','Preview aur sheet mein bhi inject']},
{t:'Layout', q:'SwiftUI ka layout system kaise kaam karta hai? (parent, child aur size)',
a:'Teen step: <b>1)</b> Parent child ko ek size propose karta hai. <b>2)</b> Child apna size khud chunta hai (Text utna hi leta hai jitna text, Spacer jitna mile utna). <b>3)</b> Parent child ko position karta hai (default center). Isliye <code>.frame(maxWidth: .infinity)</code> ek naya parent banata hai jo poori width le leta hai, aur child usme align hota hai. UIKit ke constraints jaisa koi solver nahi hota.',
k:['Parent propose karta hai','Child size chunta hai','Parent place karta hai (default center)']},
{t:'Layout', q:'<code>Spacer</code>, <code>padding</code> aur <code>VStack(spacing:)</code> mein kab kya use karoge?',
a:'<code>Spacer</code> tab, jab cheez ko kinare tak dhakelna ho ya bachi hui jagah bharni ho (button neeche chipkana ho). <code>VStack(spacing:)</code> tab, jab saare children ke beech barabar fixed gap chahiye. <code>.padding</code> tab, jab view ke charo taraf margin/inset chahiye. Ek stack mein kai Spacer hon to bachi jagah barabar batt jaati hai. Fixed gap ke liye <code>Spacer().frame(height: 24)</code> bhi chal jaata hai.',
k:['Spacer = flexible, jagah bharta hai','spacing = children ke beech fixed gap','padding = view ka margin']},
{t:'Layout', q:'<code>GeometryReader</code> kab use karna chahiye aur iske nuksan kya hain?',
a:'Jab parent ka asli size ya position chahiye ho, jaise kisi view ko screen ki 40% width dena ya scroll offset padhna. Nuksan: GeometryReader <b>jitni jagah mile, saari le leta hai</b> aur andar ke content ko top-leading par rakh deta hai, isliye layout tootta hai. Iska zyada use performance bhi girata hai. iOS 17+ mein <code>containerRelativeFrame</code> aur <code>onGeometryChange</code> aksar behtar option hain.',
c:`Image("banner")
    .resizable()
    .containerRelativeFrame(.horizontal) { w, _ in w * 0.4 }   // 40% width`,
k:['Saari jagah le leta hai','Content top-leading par','Alternatives: containerRelativeFrame']},
{t:'Lists', q:'<code>VStack</code> aur <code>LazyVStack</code> mein kya farak hai? <code>List</code> kab use karoge?',
a:'<code>VStack</code> saare children <b>turant</b> bana deta hai. 1000 rows hon to 1000 views ek saath bante hain. <code>LazyVStack</code> (ScrollView ke andar) sirf screen par dikhne wale views banata hai. <code>List</code> bhi lazy hai aur cell reuse karta hai, saath mein swipe actions, selection, sections aur edit mode deta hai. Custom design chahiye to ScrollView + LazyVStack, aur system jaisi table chahiye to List.',
k:['VStack = sab ek saath','Lazy = on demand','List = reuse + built-in features']},
{t:'Lists', q:'<code>ForEach</code> mein <code>id</code> kyun zaroori hai? Index ko id banane mein kya problem hai?',
a:'SwiftUI id se pehchanta hai ki kaunsi row same hai, kaunsi nayi hai aur kaunsi hati hai. Isi se animation aur state sahi row par rehti hai. Index (<code>0..&lt;items.count</code>) id ho aur beech se item delete ho, to neeche ki saari rows ki id badal jaati hai. Isse galat animation, galat row mein TextField ka text aur kabhi crash bhi hota hai. Model ko <code>Identifiable</code> banao aur stable <code>id</code> (UUID ya server id) do.',
c:`struct Todo: Identifiable { let id = UUID(); var title: String }
ForEach(todos) { todo in Text(todo.title) }   // stable id`,
k:['Identity se diffing','Index id = delete par bug','Identifiable + stable id']},
{t:'Navigation', q:'<code>NavigationStack</code> aur purane <code>NavigationView</code> mein kya farak hai? Code se navigate kaise karte ho?',
a:'<code>NavigationView</code> deprecated hai. <code>NavigationStack</code> data-driven hai: <code>NavigationLink(value:)</code> se sirf value bhejte ho aur <code>.navigationDestination(for:)</code> decide karta hai ki screen kaunsi hogi. Code se navigate karne ke liye ek <code>path</code> array rakho. Usme append karo to push, removeLast karo to pop.',
c:`@State private var path: [Int] = []

NavigationStack(path: $path) {
    Button("Product 5 kholo") { path.append(5) }      // push from code
        .navigationDestination(for: Int.self) { id in ProductView(id: id) }
}`,
k:['Value-based navigation','path binding = programmatic push/pop','navigationDestination ek jagah']},
{t:'Navigation', q:'Pop-to-root ya deep link (notification tap se seedha 3rd screen) kaise karoge?',
a:'Navigation state ko <code>path</code> (array ya <code>NavigationPath</code>) mein rakho, aur woh path kisi router/ViewModel mein rahe. Pop-to-root ke liye <code>path.removeAll()</code>. Deep link ke liye path ko seedha set kar do (<code>path = [.category(2), .product(9)]</code>), aur SwiftUI poora stack bana deta hai. URL <code>.onOpenURL</code> se milta hai.',
c:`enum Route: Hashable { case category(Int), product(Int) }
@Observable class Router { var path: [Route] = [] }

.onOpenURL { url in router.path = [.category(2), .product(9)] }
Button("Home") { router.path.removeAll() }            // pop to root`,
k:['Path = navigation ki state','removeAll = pop to root','Path set karna = deep link']},
{t:'Navigation', q:'<code>.sheet(isPresented:)</code> aur <code>.sheet(item:)</code> mein kya farak hai?',
a:'<code>isPresented</code> sirf Bool leta hai, isliye kaunsa data dikhana hai woh alag state mein rakhna padta hai, aur galti se purana ya nil data dikh sakta hai. <code>item:</code> ek optional <code>Identifiable</code> leta hai: value set hote hi sheet usi value ke saath khulti hai, aur band hone par khud nil ho jaati hai. Jab sheet kisi selected item par depend kare, <code>item:</code> safe hai.',
c:`@State private var selected: User?
List(users) { u in Button(u.name) { selected = u } }
    .sheet(item: $selected) { user in UserDetail(user: user) }`,
k:['item: = data + presentation ek saath','isPresented mein stale data ka risk']},
{t:'Lifecycle', q:'<code>onAppear</code> aur <code>.task</code> mein kya farak hai? API call kahan karoge?',
a:'<code>onAppear</code> synchronous hai. Usme async kaam ke liye khud <code>Task {}</code> banana padta hai, jo screen jaane par cancel nahi hota. <code>.task</code> async context deta hai aur view gayab hote hi task <b>khud cancel</b> ho jaata hai. <code>.task(id: query)</code> se id badalne par purana task cancel hokar naya chalta hai, jo search ke liye perfect hai. API call ke liye <code>.task</code> sahi hai.',
c:`.task(id: searchText) {
    try? await Task.sleep(for: .milliseconds(300))   // debounce
    await vm.search(searchText)
}`,
k:['.task = auto cancel','task(id:) = re-run on change','onAppear + Task = leak/cancel issue']},
{t:'Lifecycle', q:'<code>@MainActor</code> kya hai aur SwiftUI mein kyun zaroori hai?',
a:'UI hamesha main thread par update hona chahiye. <code>@MainActor</code> laga do (class ya function par) to compiler ensure karta hai ki woh code main thread par chalega. ViewModel par <code>@MainActor</code> lagane se API ke baad <code>self.items = data</code> safe ho jaata hai, <code>DispatchQueue.main.async</code> nahi likhna padta. Heavy kaam (JSON parse, image process) background mein karo, result main actor par set karo.',
c:`@MainActor @Observable
class FeedVM {
    var posts: [Post] = []
    func load() async {
        posts = (try? await api.fetchPosts()) ?? []   // main thread par set
    }
}`,
k:['UI = main thread','Compiler-checked safety','DispatchQueue.main ki jagah']},
{t:'Performance', q:'View ka <code>body</code> kab dobara chalta hai? Performance kaise improve karoge?',
a:'Jab bhi view ki koi dependency badle, jaise <code>@State</code>, binding, observed property ya environment value. Parent ka body chale to child ka init bhi hota hai. Tips: <b>1)</b> bade view ko chhote subviews mein todo, taaki sirf woh hissa refresh ho. <b>2)</b> <code>body</code> mein heavy kaam (sorting, formatting, date formatter banana) mat karo. <b>3)</b> <code>@Observable</code> use karo. <b>4)</b> Lambi lists mein Lazy containers aur stable id. <b>5)</b> <code>AnyView</code> se bacho. Debug ke liye <code>Self._printChanges()</code> aur Instruments ka SwiftUI template.',
k:['Dependency change = re-evaluate','Chhote views, halka body','_printChanges() se debug']},
{t:'Data', q:'<code>@AppStorage</code>, <code>@SceneStorage</code> aur SwiftData mein kab kya use karoge?',
a:'<code>@AppStorage</code>: UserDefaults wrapper, chhoti settings ke liye (dark mode, isLoggedIn). Token ya password yahan nahi, woh Keychain mein jaata hai. <code>@SceneStorage</code>: ek window/scene ki UI state restore karne ke liye (kaunsa tab khula tha). <b>SwiftData</b> (<code>@Model</code>, <code>@Query</code>): bada structured data jo persist karna ho, jaise notes, orders, offline cache. Yeh Core Data ka modern version hai.',
k:['AppStorage = choti settings','Secrets = Keychain','SwiftData = database']},
{t:'UIKit interop', q:'Koi UIKit view (jaise <code>MKMapView</code> ya custom UIView) SwiftUI mein kaise use karoge?',
a:'<code>UIViewRepresentable</code> (view controller ke liye <code>UIViewControllerRepresentable</code>) conform karo. <code>makeUIView</code> mein view ek baar banta hai, aur <code>updateUIView</code> mein SwiftUI state ke hisab se update hota hai. Delegate callbacks ke liye <code>Coordinator</code> banate hain, jo delegate ban kar SwiftUI ko data wapas bhejta hai (aksar binding se).',
c:`struct SearchBar: UIViewRepresentable {
    @Binding var text: String
    func makeUIView(context: Context) -> UISearchBar {
        let bar = UISearchBar(); bar.delegate = context.coordinator; return bar
    }
    func updateUIView(_ bar: UISearchBar, context: Context) { bar.text = text }
    func makeCoordinator() -> Coordinator { Coordinator(text: $text) }

    class Coordinator: NSObject, UISearchBarDelegate {
        @Binding var text: String
        init(text: Binding<String>) { _text = text }
        func searchBar(_ s: UISearchBar, textDidChange t: String) { text = t }
    }
}`,
k:['make = ek baar, update = har change','Coordinator = delegate bridge']},
{t:'UIKit interop', q:'Purane UIKit project mein ek nayi SwiftUI screen kaise add karoge?',
a:'SwiftUI view ko <code>UIHostingController</code> mein lapet do. Woh ek normal <code>UIViewController</code> hai, isliye push, present ya child VC kuch bhi kar sakte ho. Data closure ya shared <code>@Observable</code> object se pass karo. Isse app ko dheere-dheere screen by screen SwiftUI mein migrate kar sakte ho.',
c:`let vc = UIHostingController(rootView: ProfileView(userId: 42))
navigationController?.pushViewController(vc, animated: true)`,
k:['UIHostingController','Incremental migration']},
{t:'Architecture', q:'SwiftUI mein MVVM kaise lagate ho? ViewModel kaun own karega?',
a:'View sirf UI dikhata hai. ViewModel (<code>@Observable</code> class, aksar <code>@MainActor</code>) state rakhta hai (items, isLoading, error) aur actions deta hai (load, delete). Networking alag service/repository mein hoti hai, jo protocol ke through inject hoti hai taaki test ho sake. Jo screen ViewModel banati hai, wahi usko <code>@State</code> (purane mein <code>@StateObject</code>) se own karti hai. Child screens ko parameter ya environment se milta hai.',
c:`@MainActor @Observable
class UsersVM {
    private let api: UserService            // protocol, test mein mock
    var users: [User] = []; var error: String?
    init(api: UserService) { self.api = api }
    func load() async {
        do { users = try await api.fetch() } catch { self.error = error.localizedDescription }
    }
}`,
k:['View dumb, VM logic','Service protocol se inject','Owner = @State/@StateObject']},
{t:'Reusable UI', q:'Custom <code>ViewModifier</code> kya hota hai aur kab banate ho?',
a:'Jab ek jaisa styling ya behaviour (card look, primary button, shake on error) kai jagah lagana ho, to usko <code>ViewModifier</code> mein band karte hain. Phir <code>View</code> extension se ek line mein laga dete hain. Isse code repeat nahi hota aur design change ek jagah se ho jaata hai.',
c:`struct CardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content.padding().background(.white)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .shadow(radius: 4)
    }
}
extension View { func cardStyle() -> some View { modifier(CardStyle()) } }

Text("Hello").cardStyle()`,
k:['Reusable styling','View extension se clean API']},
{t:'Reusable UI', q:'<code>@ViewBuilder</code> kya hai? Apna container view (jaise Card { ... }) kaise banaoge?',
a:'<code>@ViewBuilder</code> ek result builder hai jo closure ke andar likhe kai views (aur if/else) ko ek view mein jod deta hai. VStack, HStack ka content isi se aata hai. Apna container banane ke liye generic <code>Content: View</code> lo aur init mein <code>@ViewBuilder</code> closure lo.',
c:`struct Card<Content: View>: View {
    let title: String
    @ViewBuilder var content: Content
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title).font(.headline)
            content
        }
        .padding().background(.thinMaterial, in: .rect(cornerRadius: 12))
    }
}

Card(title: "Profile") { Text("Rahul"); Text("iOS Dev") }`,
k:['Result builder','Generic Content: View','Custom containers']},
{t:'Animation', q:'Implicit aur explicit animation mein kya farak hai? Transition kya hota hai?',
a:'<b>Implicit</b>: <code>.animation(.spring, value: x)</code> view par lagao, aur jab bhi <code>x</code> badle, us view ke changes animate honge. <b>Explicit</b>: <code>withAnimation { x.toggle() }</code>, jisme us state change se hone wale saare UI changes animate hote hain. <b>Transition</b> batata hai ki view screen par <b>aate/jaate</b> waqt kaise animate ho (<code>.transition(.slide)</code>). Yeh tabhi chalta hai jab view if-condition se add/remove ho aur change animation ke andar ho.',
c:`@State private var show = false

Button("Toggle") { withAnimation(.spring) { show.toggle() } }   // explicit
if show {
    Text("Hello").transition(.move(edge: .bottom).combined(with: .opacity))
}`,
k:['Implicit = value se bandha','Explicit = withAnimation','Transition = insert/remove']}
];
