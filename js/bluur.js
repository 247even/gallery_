var bluur=function(n,t,i){var u="";return{image:function(n,t,i){$.get(u,{img:n,depth:t}).done(function(n){i(n)})},config:function(n){u=n}}}(this,this.document);