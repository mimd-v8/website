(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{66:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return s})),t.d(n,"metadata",(function(){return i})),t.d(n,"rightToc",(function(){return l})),t.d(n,"default",(function(){return p}));var o=t(2),a=t(6),r=(t(0),t(78)),s={slug:"tips-for-secure-django-graphene",title:"Tips for secure Django Graphene",tags:["django","graphql","graphene","relay","security","filtering"]},i={permalink:"/tips-for-secure-django-graphene",source:"@site/blog/2020-11-29-tips-for-secure-django-graphene.md",description:"A few ways to make sure your Django app's GraphQL API only returns the data you want, especially in multi-tenant apps",date:"2020-11-29T00:00:00.000Z",tags:[{label:"django",permalink:"/tags/django"},{label:"graphql",permalink:"/tags/graphql"},{label:"graphene",permalink:"/tags/graphene"},{label:"relay",permalink:"/tags/relay"},{label:"security",permalink:"/tags/security"},{label:"filtering",permalink:"/tags/filtering"}],title:"Tips for secure Django Graphene",readingTime:3.245,truncated:!0,nextItem:{title:"React and Django in 2020",permalink:"/react-and-django-in-2020"}},l=[{value:"Override <code>get_queryset</code>",id:"override-get_queryset",children:[]},{value:"Override <code>get_node</code>",id:"override-get_node",children:[]},{value:"Check built-in Django model permissions",id:"check-built-in-django-model-permissions",children:[]},{value:"Use in mutations",id:"use-in-mutations",children:[]},{value:"Summary",id:"summary",children:[]}],c={rightToc:l};function p(e){var n=e.components,t=Object(a.a)(e,["components"]);return Object(r.b)("wrapper",Object(o.a)({},c,t,{components:n,mdxType:"MDXLayout"}),Object(r.b)("p",null,"A few ways to make sure your Django app's GraphQL API only returns the data you want, especially in multi-tenant apps"),Object(r.b)("p",null,"If you set up the schema based on the Graphene tutorial, you'll get access to all model instances.\nIn an existing app you might have permissions and filtering set up so that users can only see certain data."),Object(r.b)("p",null,"How can we implement this in Graphene when using Relay nodes?"),Object(r.b)("h2",{id:"override-get_queryset"},"Override ",Object(r.b)("inlineCode",{parentName:"h2"},"get_queryset")),Object(r.b)("p",null,"When you define an object type, link it in the Query class using a DjangoFilterConnectionField.\nThis will let you override the ",Object(r.b)("inlineCode",{parentName:"p"},"get_queryset")," class method:"),Object(r.b)("pre",null,Object(r.b)("code",Object(o.a)({parentName:"pre"},{className:"language-python"}),"from django.db import models\nfrom django.contrib.auth.models import User\nimport graphene\nfrom graphene_django import DjangoObjectType\nfrom graphene_django.filter import DjangoFilterConnectionField\n\n\nclass Foo(models.Model):\n    owner = models.ForeignKey(User, on_delete=models.PROTECT)\n\n\nclass FooNode(DjangoObjectType):\n    class Meta:\n        model = Foo\n    \n    @classmethod\n    def get_queryset(cls, queryset, info):\n        return Foo.objects.filter(owner=info.context.user)\n\n\nclass Query(graphene.ObjectType):\n    foo_set = DjangoFilterConnectionField(FooNode)\n")),Object(r.b)("p",null,"Lets say each model already had a function that returns an appropriately scoped queryset, you could extend the DjangoObjectType class with this logic in a reusable way:"),Object(r.b)("pre",null,Object(r.b)("code",Object(o.a)({parentName:"pre"},{className:"language-python"}),"class Foo(models.Model):\n    owner = models.ForeignKey(User, on_delete=models.PROTECT)\n\n    @staticmethod\n    def scoped_queryset(user):\n        return Foo.objects.filter(owner=user)\n\n\nclass ScopedObjectType(DjangoObjectType):\n    class Meta:\n        abstract = True\n\n    @classmethod\n    def get_queryset(cls, queryset, info):\n        return cls._meta.model.scoped_queryset(info.context.user)\n\n\nclass FooNode(ScopedObjectType):\n    class Meta:\n        model = Foo\n")),Object(r.b)("h2",{id:"override-get_node"},"Override ",Object(r.b)("inlineCode",{parentName:"h2"},"get_node")),Object(r.b)("p",null,"The ",Object(r.b)("inlineCode",{parentName:"p"},"get_queryset")," method covers a list type response in the GraphQL API, but what about querying for specific instances of a model?"),Object(r.b)("p",null,"Use the ",Object(r.b)("inlineCode",{parentName:"p"},"get_node")," class method:"),Object(r.b)("pre",null,Object(r.b)("code",Object(o.a)({parentName:"pre"},{className:"language-python"}),"class Foo(models.Model):\n    owner = models.ForeignKey(User, on_delete=models.PROTECT)\n\n\nclass FooNode(DjangoObjectType):\n    class Meta:\n        model = Foo\n    \n    @classmethod\n    def get_node(cls, info, id):\n        try:\n            node = Foo.objects.get(pk=id)\n        except:\n            return None\n        # some validation here\n        if node.user != info.context.user:\n            return None\n        return node\n\n\nclass Query(graphene.ObjectType):\n    foo = graphene.relay.Node.Field(FooNode)\n")),Object(r.b)("p",null,"Again you could make the implementation of ",Object(r.b)("inlineCode",{parentName:"p"},"get_node")," generic and include it in an abstract class:"),Object(r.b)("pre",null,Object(r.b)("code",Object(o.a)({parentName:"pre"},{className:"language-python"}),"class ScopedObjectType(DjangoObjectType):\n    class Meta:\n        abstract = True\n\n    @classmethod\n    def get_node(cls, info, id):\n        qs = cls._meta.model.scoped_queryset(info.context.user)\n        try:\n            node = qs.get(pk=id)\n        except cls._meta.model.DoesNotExist:\n            return None\n        return node\n")),Object(r.b)("h2",{id:"check-built-in-django-model-permissions"},"Check built-in Django model permissions"),Object(r.b)("p",null,"Checking the model permissions is also probably essential in any Django app."),Object(r.b)("p",null,"Once you have started overriding ",Object(r.b)("inlineCode",{parentName:"p"},"get_queryset")," and ",Object(r.b)("inlineCode",{parentName:"p"},"get_node"),", you can check permissions from the built-in Django authorization system in the same place."),Object(r.b)("pre",null,Object(r.b)("code",Object(o.a)({parentName:"pre"},{className:"language-python"}),'class FooNode(DjangoObjectType):\n    class Meta:\n        model = Foo\n    \n    @classmethod\n    def get_queryset(cls, queryset, info):\n        if not info.context.user.has_perm("myapp.view_foo"):\n            return Foo.objects.none()\n        return queryset\n\n    @classmethod\n    def get_node(cls, info, id):\n        if not info.context.user.has_perm("myapp.view_foo"):\n            return None\n        try:\n            node = Foo.objects.get(pk=id)\n        except:\n            return None\n        return node\n')),Object(r.b)("p",null,"Making a generic implementation is a bit tricky - how to programatically create the permission name to check against the user?"),Object(r.b)("p",null,"If you use something like Django Guardian or Django Rules, you probably have a way to do it already."),Object(r.b)("p",null,"But for plain Django, a quick and easy way to get a permission name based on a model class could be:"),Object(r.b)("pre",null,Object(r.b)("code",Object(o.a)({parentName:"pre"},{}),'perm_name = "%s.%s_%s" % (Foo._meta.app_label, "view", Foo.__name__.lower())\n')),Object(r.b)("p",null,"Use in a generic implementation you could do something like:"),Object(r.b)("pre",null,Object(r.b)("code",Object(o.a)({parentName:"pre"},{className:"language-python"}),'class FooNode(DjangoObjectType):\n    class Meta:\n        model = Foo\n    \n    @classmethod\n    def get_queryset(cls, queryset, info):\n        perm_view = "%s.%s_%s" % (cls._meta.model._meta.app_label, "view", cls._meta.model.__name__.lower())\n        if not info.context.user.has_perm(perm_view):\n            return cls._meta.objects.none()\n        return queryset\n')),Object(r.b)("h2",{id:"use-in-mutations"},"Use in mutations"),Object(r.b)("p",null,"The same strategies above also apply for mutations, inside the class methods like"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"mutate")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"mutate_and_get_playload")," (for Relay)")),Object(r.b)("p",null,"Especially for permission checks, you could check for the built in ",Object(r.b)("inlineCode",{parentName:"p"},"add"),", ",Object(r.b)("inlineCode",{parentName:"p"},"change")," and ",Object(r.b)("inlineCode",{parentName:"p"},"delete")," model permissions."),Object(r.b)("h2",{id:"summary"},"Summary"),Object(r.b)("p",null,"Django Graphene follows a similar pattern to Django itself, simply overriding functions to resolve single instances or to return querysets."),Object(r.b)("p",null,"It doesn't provide default abstract classes that implement this behaviour, such as to respect the built in model permissions - so it can be more difficult to get going that something such as Django REST Framework."),Object(r.b)("p",null,"But once you've set it up, its very flexible.\nAnd if GraphQL ends up being the primary API you interact with your Django application, sooner or later you would want to customise any logic that is provided by default anyway."))}p.isMDXComponent=!0},78:function(e,n,t){"use strict";t.d(n,"a",(function(){return u})),t.d(n,"b",(function(){return m}));var o=t(0),a=t.n(o);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,o)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,o,a=function(e,n){if(null==e)return{};var t,o,a={},r=Object.keys(e);for(o=0;o<r.length;o++)t=r[o],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)t=r[o],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var c=a.a.createContext({}),p=function(e){var n=a.a.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},u=function(e){var n=p(e.components);return a.a.createElement(c.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return a.a.createElement(a.a.Fragment,{},n)}},b=a.a.forwardRef((function(e,n){var t=e.components,o=e.mdxType,r=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=p(t),b=o,m=u["".concat(s,".").concat(b)]||u[b]||d[b]||r;return t?a.a.createElement(m,i(i({ref:n},c),{},{components:t})):a.a.createElement(m,i({ref:n},c))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var r=t.length,s=new Array(r);s[0]=b;var i={};for(var l in n)hasOwnProperty.call(n,l)&&(i[l]=n[l]);i.originalType=e,i.mdxType="string"==typeof e?e:o,s[1]=i;for(var c=2;c<r;c++)s[c]=t[c];return a.a.createElement.apply(null,s)}return a.a.createElement.apply(null,t)}b.displayName="MDXCreateElement"}}]);