<cfcomponent>
    <cffunction name="post" access="remote" returntype="string" returnformat="plain" output="false">
        <cfargument name="url"type="string" required="false" default="http://www.systranet.com/sai?gui=text&service=urlmarkuptranslate&lp=en_zh" />
        <cfargument name="data" type="string" required="false" default="fuck me in the ass" />
        <cfset local.response = arguments />
        <cfhttp url="#arguments.url#" method="post">
            <cfhttpparam type="header" name="Content-type" value="application/x-www-form-urlencoded; charset=UTF-8" />
            <cfhttpparam type="body" value="#arguments.data#" />
        </cfhttp>

        <cfdump var="#cfhttp#" abort="true" />

        <cfset local.response["response"] = cfhttp.filecontent />
        <cfset local.response = serializejson(local.response) />
        <cfset local.response = right(local.response, len(local.response)-2) />
        <cfcontent type="application/json" />
        <cfreturn local.response />
    </cffunction>
</cfcomponent>