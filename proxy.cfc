<cfcomponent>
    <cffunction name="post" access="remote" returntype="string" output="false">
        <cfargument name="url"type="string" required="false" default="http://svstxt.systransoft.com/?gui=vgadget&service=translate&loca=ZH&lp=en_zh" />
        <cfargument name="data" type="string" required="false" default="fuck me in the ass" />
        <cfhttp url="#arguments.url#" method="post">
            <cfhttpparam type="formfield" name="#arguments.data#" value="" />
        </cfhttp>
        <cfdump var="#cfhttp#" />
        <cfset local.response = cfhttp />
        <cfreturn local.response />
    </cffunction>
</cfcomponent>