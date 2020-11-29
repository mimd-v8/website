---
slug: tips-for-secure-django-graphene
title: Tips for secure Django Graphene
tags: [django, graphql, graphene, relay, security, filtering]
---

A few ways to make sure your Django app's GraphQL API only returns the data you want, especially in multi-tenant apps

<!-- truncate -->

If you set up the schema based on the Graphene tutorial, you'll get access to all model instances.
In an existing app you might have permissions and filtering set up so that users can only see certain data.

How can we implement this in Graphene when using Relay nodes?

## Override `get_queryset`

When you define an object type, link it in the Query class using a DjangoFilterConnectionField.
This will let you override the `get_queryset` class method:

```python
from django.db import models
from django.contrib.auth.models import User
import graphene
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField


class Foo(models.Model):
    owner = models.ForeignKey(User, on_delete=models.PROTECT)


class FooNode(DjangoObjectType):
    class Meta:
        model = Foo
    
    @classmethod
    def get_queryset(cls, queryset, info):
        return Foo.objects.filter(owner=info.context.user)


class Query(graphene.ObjectType):
    foo_set = DjangoFilterConnectionField(FooNode)
```

Lets say each model already had a function that returns an appropriately scoped queryset, you could extend the DjangoObjectType class with this logic in a reusable way:

```python
class Foo(models.Model):
    owner = models.ForeignKey(User, on_delete=models.PROTECT)

    @staticmethod
    def scoped_queryset(user):
        return Foo.objects.filter(owner=user)


class ScopedObjectType(DjangoObjectType):
    class Meta:
        abstract = True

    @classmethod
    def get_queryset(cls, queryset, info):
        return cls._meta.model.scoped_queryset(info.context.user)


class FooNode(ScopedObjectType):
    class Meta:
        model = Foo
```

## Override `get_node`

The `get_queryset` method covers a list type response in the GraphQL API, but what about querying for specific instances of a model?

Use the `get_node` class method:

```python
class Foo(models.Model):
    owner = models.ForeignKey(User, on_delete=models.PROTECT)


class FooNode(DjangoObjectType):
    class Meta:
        model = Foo
    
    @classmethod
    def get_node(cls, info, id):
        try:
            node = Foo.objects.get(pk=id)
        except:
            return None
        # some validation here
        if node.user != info.context.user:
            return None
        return node


class Query(graphene.ObjectType):
    foo = graphene.relay.Node.Field(FooNode)
```

Again you could make the implementation of `get_node` generic and include it in an abstract class:

```python
class ScopedObjectType(DjangoObjectType):
    class Meta:
        abstract = True

    @classmethod
    def get_node(cls, info, id):
        qs = cls._meta.model.scoped_queryset(info.context.user)
        try:
            node = qs.get(pk=id)
        except cls._meta.model.DoesNotExist:
            return None
        return node
```

## Check built-in Django model permissions

Checking the model permissions is also probably essential in any Django app.

Once you have started overriding `get_queryset` and `get_node`, you can check permissions from the built-in Django authorization system in the same place.

```python
class FooNode(DjangoObjectType):
    class Meta:
        model = Foo
    
    @classmethod
    def get_queryset(cls, queryset, info):
        if not info.context.user.has_perm("myapp.view_foo"):
            return Foo.objects.none()
        return queryset

    @classmethod
    def get_node(cls, info, id):
        if not info.context.user.has_perm("myapp.view_foo"):
            return None
        try:
            node = Foo.objects.get(pk=id)
        except:
            return None
        return node
```

Making a generic implementation is a bit tricky - how to programatically create the permission name to check against the user?

If you use something like Django Guardian or Django Rules, you probably have a way to do it already.

But for plain Django, a quick and easy way to get a permission name based on a model class could be:

```
perm_name = "%s.%s_%s" % (Foo._meta.app_label, "view", Foo.__name__.lower())
```

Use in a generic implementation you could do something like:

```python
class FooNode(DjangoObjectType):
    class Meta:
        model = Foo
    
    @classmethod
    def get_queryset(cls, queryset, info):
        perm_view = "%s.%s_%s" % (cls._meta.model._meta.app_label, "view", cls._meta.model.__name__.lower())
        if not info.context.user.has_perm(perm_view):
            return cls._meta.objects.none()
        return queryset
```

## Use in mutations

The same strategies above also apply for mutations, inside the class methods like

- `mutate`
- `mutate_and_get_playload` (for Relay)

Especially for permission checks, you could check for the built in `add`, `change` and `delete` model permissions.

## Summary

Django Graphene follows a similar pattern to Django itself, simply overriding functions to resolve single instances or to return querysets.

It doesn't provide default abstract classes that implement this behaviour, such as to respect the built in model permissions - so it can be more difficult to get going that something such as Django REST Framework.

But once you've set it up, its very flexible.
And if GraphQL ends up being the primary API you interact with your Django application, sooner or later you would want to customise any logic that is provided by default anyway.