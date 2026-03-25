#pragma once

struct PluginApi {
    virtual ~PluginApi() = default;
    virtual const char* Name() const = 0;
    virtual void Execute() = 0;
};

using CreatePluginFn = PluginApi* (*)();
using DestroyPluginFn = void (*)(PluginApi*);
