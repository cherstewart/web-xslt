var mmlns = "http://www.w3.org/1998/Math/MathML";
var ctopT= [];
var ctopTapply = [];


function ctop (){
    var mm = document.getElementsByTagName('math');
    for (var i = 0; i< mm.length;i++){
	ctopAT (mm[i],0); 
    }
}

function ctopE (e) {
return document.createElementNS(mmlns,e);
}

function ctopAT(n,p) {
    if (n.nodeType==1) {
	if(ctopT[n.localName]) {
	    ctopT[n.localName](n,p);
	} else if (n.childNodes.length==0) {
	    ctopMI(n,n.localName);
	} else {
	    for(var j=0;j<n.childNodes.length; j++ ) {
		ctopAT(n.childNodes[j],p);
	    }
	}
    }
}


ctopT["ci"] = function(n,p) {
    ctopToken(n,'mi');
}

ctopT["csymbol"] = function(n,p) {
    if(ctopG[n.textContent]){
	ctopMI(n,ctopG[n.textContent]);
    } else {
	ctopToken(n,'mi');
    }
}
var ctopG=[];
ctopG['gamma']='\u03B3';


function ctopToken(n,s) {
    var np=n.parentNode;
    if(n.childNodes.length==1 && n.childNodes[0].nodeType==3) {
	var m=ctopE(s);
	m.textContent=n.textContent;
	np.replaceChild(m,n);
    } else {
	var mrow=ctopE('mrow');
	np.replaceChild(mrow,n);
	for(var j=0;j<n.childNodes.length; j++ ) {
	    if (n.childNodes[j].nodeType==3) {
		var m=ctopE(s);
		m.textContent=n.childNodes[j].textContent;
		mrow.appendChild(m);
	    }else{
  		mrow.appendChild(n.childNodes[j])
		ctopAT(mrow.childNodes[j],0);
	    }
	}
    }
}



ctopT["apply"] = function(n,p) {
    var f=null;
    var a=[],b=[],q=[];
    for(var j=0;j<n.childNodes.length; j++ ) {
	if(n.childNodes[j].nodeType==1) {
	    var nd=nm=n.childNodes[j], nm=nd.localName;
	    if(nm=='bvar'){
		b[b.length]=nd;
	    } else if(nm=='condition'||
		      nm=='degree'||
		      nm=='logbase'||
		      nm=='lowlimit'||
		      nm=='uplimit'||
		      nm=='interval'||
		      nm=='domainofapplication') {
		q[q.length]=nd;
	    } else if(f==null){
		f=nd;		
	    } else {
		a[a.length]=nd;
	    }
	}
    }
    if(f) {
	var nm = f.localName;
	nm=(nm=="csymbol") ? f.textContent : nm;
	if(ctopTapply[nm]) {
	    ctopTapply[nm](n,f,a,b,q,p);
	} else {
	    var mrow=ctopE('mrow');
	    n.parentNode.replaceChild(mrow,n);
	    if(f.childNodes.length){
		mrow.appendChild(f);
		ctopAT(f,0);
	    } else {
		var mi=ctopE('mi');
		mi.textContent=nm;
		mrow.appendChild(mi);
	    }
	    mrow.appendChild(ctopfa.cloneNode(true));
	    mrow.appendChild(ctopMF(a,'(',')'));
	}
    } else {
	var mrow=ctopE('mrow');
	n.parentNode.replaceChild(mrow,n);
    }
}

ctopT["reln"] = ctopT["apply"];
ctopT["bind"] = ctopT["apply"];

function ctopMF(a,o,c) {
    var mf = ctopE('mfenced');
    mf.setAttribute('open',o);
    mf.setAttribute('close',c);
    for(var j=0;j<a.length; j++ ) {
	var z= a[j].cloneNode(true);
  	mf.appendChild(z)
	ctopAT(z,0);
    }
    return mf;
}



var ctopfa=ctopE('mo');
ctopfa.textContent='\u2061';



function ctopB(n,tp,p,m,a) {
    var mf = ctopE('mrow');
    if(tp>p || (tp==p && m=="-")) {
        var mo=ctopfa.cloneNode(true);
	mo.textContent="(";
	mf.appendChild(mo);
    }
    if(a.length>1){
	var z= a[0].cloneNode(true);
	mf.appendChild(z)
	ctopAT(z,p);
    }
    
    var mo=ctopfa.cloneNode(true);
    mo.textContent=m;
    mf.appendChild(mo);

    if(a.length>0){
	var z= a[(a.length==1)?0:1].cloneNode(true);
	mf.appendChild(z)
	ctopAT(z,p);
    }
    
    if(tp>p || (tp==p && m=="-")) {
	var mo=ctopfa.cloneNode(true);
	mo.textContent=")";
	mf.appendChild(mo);
    }
    n.parentNode.replaceChild(mf,n);
}





ctopTapply["divide"] = function(n,f,a,b,q,p)  {ctopB(n,3,p,"/",a)}
ctopTapply["minus"] = function(n,f,a,b,q,p)  {ctopB(n,2,p,"-",a)}
ctopTapply["remainder"] = function(n,f,a,b,q,p)  {ctopB(n,3,p,"mod",a)}
ctopTapply["implies"] = function(n,f,a,b,q,p)  {ctopB(n,3,p,"\u21D2",a)}
ctopTapply["factorof"] = function(n,f,a,b,q,p)  {ctopB(n,3,p,"\u21D2",a)}
ctopTapply["in"] = function(n,f,a,b,q,p)  {ctopB(n,3,p,"\u2208",a)}
ctopTapply["notin"] = function(n,f,a,b,q,p)  {ctopB(n,3,p,"\u2209",a)}
ctopTapply["notsubset"] = function(n,f,a,b,q,p)  {ctopB(n,2,p,"\u2288",a)}
ctopTapply["notprsubset"] = function(n,f,a,b,q,p)  {ctopB(n,2,p,"\u2284",a)}
ctopTapply["setdiff"] = function(n,f,a,b,q,p)  {ctopB(n,2,p,"\u2216",a)}
ctopTapply["tendsto"] = function(n,f,a,b,q,p)  {
    var t;
    if(f.localName=='tendsto') {
	t=f.getAttribute('type');
    } else {
	t=a[0].textContent;
	a[0]=a[1];
	a[1]=a[2];
    }
    var m = (t=='above')? '\u2198' :
        (t=='below')? '\u2198' : '\u2192' ;
    ctopB(n,2,p,m,a);
}



ctopTapply["complex-cartesian"] = function(n,f,a,b,q,p)  {
    var mf = ctopE('mrow');
    var z= a[0].cloneNode(true);
    mf.appendChild(z)
    ctopAT(z,0);
    var mo=ctopfa.cloneNode(true);
    mo.textContent="+";
    mf.appendChild(mo);
    var z= a[1].cloneNode(true);
    mf.appendChild(z)
    ctopAT(z,0);
    var mo=ctopfa.cloneNode(true);
    mo.textContent="\u2062";
	mf.appendChild(mo);
    var mi = ctopE('mi');
    mi.textContent="i";
    mf.appendChild(mi);
    n.parentNode.replaceChild(mf,n);
}
ctopTapply["complex-polar"] = function(n,f,a,b,q,p)  {
    var mf = ctopE('mrow');
    var z= a[0].cloneNode(true);
    mf.appendChild(z)
    ctopAT(z,0);
    var mo=ctopfa.cloneNode(true);
    mo.textContent="\u2062";
    mf.appendChild(mo);
    var s = ctopE('msup');
    var mi = ctopE('mi');
    var mr = ctopE('mrow');
    mi.textContent="e";
    s.appendChild(mi);
    var z= a[1].cloneNode(true);
    mr.appendChild(z)
    ctopAT(z,0);
    mr.appendChild(mo.cloneNode(true))
    mi=mi.cloneNode(mi);
    mi.textContent="i";
    mr.appendChild(mi);
    s.appendChild(mr);
    mf.appendChild(s);
    n.parentNode.replaceChild(mf,n);
}


ctopTapply["integer"] = function(n,f,a,b,q,p)  {
    n.parentNode.replaceChild(a[0],n);
    ctopAT(a[0]);
}

ctopTapply["based-integer"] = function(n,f,a,b,q,p)  {
    var s = ctopE('msub');
    var z= a[1].cloneNode(true);
    s.appendChild(z)
    ctopAT(z,p);
    var z= a[0].cloneNode(true);
    s.appendChild(z)
    ctopAT(z,p);
    n.parentNode.replaceChild(s,n);
}

ctopTapply["rational"] = function(n,f,a,b,q,p)  {
    var s = ctopE('mfrac');
    var z= a[0].cloneNode(true);
    s.appendChild(z)
    ctopAT(z,p);
    var z= a[1].cloneNode(true);
    s.appendChild(z)
    ctopAT(z,p);
    n.parentNode.replaceChild(s,n);
}


ctopT["cn"] = function(n,p) {
    var t=n.getAttribute("type");
    var b=n.getAttribute("base");
    if(t||b) {
	var ap = ctopE('apply');
	var mrow = ctopE('mrow');
	var c;
	if( b) {
	    t='based-integer';
	    c = ctopE(t);
	    ap.appendChild(c);
	    mn = ctopE('mn');
	    mn.textContent=b;
	    ap.appendChild(mn);
	} else {
	    c = ctopE(t);
	    ap.appendChild(c);
	}
	for(var j=0;j<n.childNodes.length; j++ ) {
	    if (n.childNodes[j].nodeType==3) {
		var m=ctopE('cn');
		m.textContent=n.childNodes[j].textContent;
		mrow.appendChild(m);
	    }else if (n.childNodes[j].localName=='sep'){
		ap.appendChild(mrow);
		mrow = ctopE('mrow');
	    } else {
  		mrow.appendChild(n.childNodes[j])
	    }
	}
	ap.appendChild(mrow);
	n.parentNode.replaceChild(ap,n);
	ctopAT(ap,0);
    } else {   
	ctopToken(n,'mn');
    }
}


function ctopMI (n,s){
    m = ctopE('mi');
    m.textContent=s;
    n.parentNode.replaceChild(m,n);
}

ctopT["naturalnumbers"] = function(n,p) {ctopMI(n,"\u2115")}
ctopT["integers"] = function(n,p) {ctopMI(n,"\u2124")}
ctopT["reals"] = function(n,p) {ctopMI(n,"\u211D")}
ctopT["rationals"] = function(n,p) {ctopMI(n,"\u211A")}
ctopT["complexes"] = function(n,p) {ctopMI(n,"\u2102")}
ctopT["primes"] = function(n,p) {ctopMI(n,"\u2119")}
ctopT["exponentiale"] = function(n,p) {ctopMI(n,"e")}
ctopT["imaginaryi"] = function(n,p) {ctopMI(n,"i")}
ctopT["notanumber"] = function(n,p) {ctopMI(n,"NaN")}
ctopT["eulergamma"] = function(n,p) {ctopMI(n,"\u03B3")}
ctopT["gamma"] = function(n,p) {ctopMI(n,"\u0263")}
ctopT["pi"] = function(n,p) {ctopMI(n,"\u03C0")}
ctopT["infinity"] = function(n,p) {ctopMI(n,"\u221E")}
ctopT["emptyset"] = function(n,p) {ctopMI(n,"\u2205")}
ctopT["true"] = function(n,p) {ctopMI(n,"true")}
ctopT["false"] = function(n,p) {ctopMI(n,"false")}





ctopI = function(n,f,a,p,tp,s)  {
    var mf = ctopE('mrow');
    if(p>tp) {
        var mo=ctopfa.cloneNode(true);
	mo.textContent="(";
	mf.appendChild(mo);
    }
    for(var j=0;j<a.length; j++ ) {
	var z= a[j].cloneNode(true);
	if(j>0) {
            var mo=ctopfa.cloneNode(true);
	    mo.textContent=s;
	    mf.appendChild(mo);
	}
  	mf.appendChild(z)
	ctopAT(z,tp);
    }
    if(p>tp) {
        var mo=ctopfa.cloneNode(true);
	mo.textContent=")";
	mf.appendChild(mo);
    }
    n.parentNode.replaceChild(mf,n);
}

ctopTapply["plus"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,2,"+")}
ctopTapply["eq"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,1,"=")}
ctopTapply["compose"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,1,"\u2218")}
ctopTapply["left_compose"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,1,"\u2218")}
ctopTapply["and"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,2,"\u2227")}
ctopTapply["or"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,3,"\u2228")}
ctopTapply["xor"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,3,"xor")}
ctopTapply["neq"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,1,"\u2260")}
ctopTapply["gt"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,1,"<")}
ctopTapply["lt"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,1,">")}
ctopTapply["geq"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,1,"\u2265")}
ctopTapply["leq"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,1,"\u2264")}
ctopTapply["equivalent"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,1,"\u2261")}
ctopTapply["approx"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,1,"\u2243")}
ctopTapply["union"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,2,"\u222A")}
ctopTapply["intersect"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,3,"\u2229")}
ctopTapply["subset"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,2,"\u2286")}
ctopTapply["prsubset"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,2,"\u2282")}
ctopTapply["cartesianproduct"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,2,"\u00D7")}
ctopTapply["cartesian_product"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,2,"\u00D7")}
ctopTapply["vectorproduct"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,2,"\u00D7")}
ctopTapply["scalarproduct"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,2,".")}
ctopTapply["outerproduct"] = function(n,f,a,b,q,p) {ctopI(n,f,a,p,2,"\u2297")}


ctopT["set"] = function(n,p) {ctopS(n,n.children,'{','}')};
ctopTapply["set"] = function(n,f,a,b,q,p) {ctopS(n,a,'{','}')};
ctopT["list"] = function(n,p) {ctopS(n,n.children,'(',')')};
ctopTapply["list"] = function(n,f,a,b,q,p) {ctopS(n,a,'(',')')};

ctopT["interval"] = function(n,p) {
    var c=n.getAttribute('closure');
    ctopS(n,n.children,
	  (c=='open' || c=='open-closed')?'(':'[',
	  (c=='open' || c=='closed-open')?')':']'
	 )};

function ctopS (n,a,o,c){
    n.parentNode.replaceChild(ctopMF(a,o,c),n);
}


				   

ctopT["piecewise"] = function(n,p)  {
    var mr = ctopE('mrow');
    var mo=ctopfa.cloneNode(true);
    mo.textContent="{";
    mr.appendChild(mo);
    var mt = ctopE('mtable');
    mr.appendChild(mt);
    for(var i=0;i<n.children.length;i++){
	var z= n.children[i].cloneNode(true);
	mt.appendChild(z)
	ctopAT(z,0);
    }
    n.parentNode.replaceChild(mr,n);
}

ctopT["piece"] = function(n,p) {
    var mtr = ctopE('mtr');
    for(i=0;i<n.children.length;i++){
	var mtd = ctopE('mtd');
	mtr.appendChild(mtd);
	var z= n.children[i].cloneNode(true);
	mtd.appendChild(z)
	ctopAT(z,0);
	if(i==0){
	var mtd = ctopE('mtd');
	    mtd.textContent="\u00A0if\u00A0";
	    mtr.appendChild(mtd);
	}
    }
    n.parentNode.replaceChild(mtr,n);
};

ctopT["otherwise"] = function(n,p) {
    var mtr = ctopE('mtr');
    if(n.children.length>0){
	var mtd = ctopE('mtd');
	mtr.appendChild(mtd);
	var z= n.children[0].cloneNode(true);
	mtd.appendChild(z)
	ctopAT(z,0);
	var mtd = ctopE('mtd');
	mtd.setAttribute('columnspan','2');
	mtd.textContent="\u00A0otherwise";
	mtr.appendChild(mtd);
    }
    n.parentNode.replaceChild(mtr,n);
};

ctopT["matrix"] = function(n,p) {
    var a=[],b=[],q=[];
    for(var j=0;j<n.childNodes.length; j++ ) {
	var c=n.childNodes[j]
	if(c.nodeType==1) {
	    if(c.localName=='condition' || c.localName=='domainofapplication' ) {
		q[q.length]=c;
	    } else if(c.localName=='bvar') {
		b[b.length]=c;
	    } else {
		a[a.length]=c;
	    }
	}
    }
    if(b.length||q.length){
	var mr = ctopE('mrow');
	var mo=ctopfa.cloneNode(true);
	mo.textContent="[";
	mr.appendChild(mo);
	var ms = ctopE('msub');
	mi = ctopE('mi');
	mi.textContent='m';
	ms.appendChild(mi);
	var mr2 = ctopE('mrow');
	for(var i=0;i<b.length;i++){
	    if(i!=0){
		mo=ctopfa.cloneNode(true);
		mo.textContent=",";
		mr2.appendChild(mo);
	    }	
	    var z=b[i].childNodes[0];
	    mr2.appendChild(z);
            ctopAT(z,0);
	}
	ms.appendChild(mr2);
	var ms2=ms.cloneNode(true);
	mr.appendChild(ms);
	mo=ctopfa.cloneNode(true);
	mo.textContent="|";
	mr.appendChild(mo);
	mr.appendChild(ms2);
	mo=ctopfa.cloneNode(true);
	mo.textContent="=";
	mr.appendChild(mo);
	for(var i=0;i<a.length;i++){
	    if(i!=0){
		mo=ctopfa.cloneNode(true);
		mo.textContent=",";
		mr.appendChild(mo);
	    }	
	    mr.appendChild(a[i]);
            ctopAT(a[i],0);
	}
	mo=ctopfa.cloneNode(true);				 
	mo.textContent=";";
	mr.appendChild(mo);
	for(var i=0;i<q.length;i++){
	    if(i!=0){
		mo=ctopfa.cloneNode(true);
		mo.textContent=",";
		mr.appendChild(mo);
	    }	
	    mr.appendChild(q[i]);
            ctopAT(q[i],0);
	}
	mo=ctopfa.cloneNode(true);
	mo.textContent="]";
	mr.appendChild(mo);
      	n.parentNode.replaceChild(mr,n);
    } else {
	var mf = ctopE('mfenced');
	var mt = ctopE('mtable');
	for(var i=0;i<a.length;i++){
	    mt.appendChild(a[i]);
	    ctopAT(a[i]);
	}
      	mf.appendChild(mt);
      	n.parentNode.replaceChild(mf,n);
    }
}
	  

ctopT["matrixrow"] = function(n,p){
    var mtr = ctopE('mtr');
    while(n.children.length){
	var mtd = ctopE('mtd');
	var z=n.children[0];
	mtd.appendChild(z);
	ctopAT(z);
	mtr.appendChild(mtd);
    }
    n.parentNode.replaceChild(mtr,n);
}


ctopTapply["power"] = function(n,f,a,b,q,p)  {
    var s = ctopE('msup');
    var z= a[0].cloneNode(true);
    s.appendChild(z)
    ctopAT(z,p);
    var z= a[1].cloneNode(true);
    s.appendChild(z)
    ctopAT(z,p);
    n.parentNode.replaceChild(s,n);
}


ctopT["condition"] = function(n,p)  {
    var mr = ctopE('mrow');
    for(var i=0;i<n.children.length;i++){
	var z= n.children[i];
	mr.appendChild(z)
	ctopAT(z,0);
    }
    n.parentNode.replaceChild(mr,n);
}


ctopTapply["selector"] = function(n,f,a,b,q,p){
    var ms = ctopE('msub');
    var z=(a)? a[0]: ctopE('mrow');
    ms.appendChild(z);
    ctopAT(z);
    var mr2 = ctopE('mrow');
    for(var i=1;i<a.length;i++){
	if(i!=1){
	    mo=ctopfa.cloneNode(true);
	    mo.textContent=",";
	    mr2.appendChild(mo);
	}	
	var z=n.children[i];
	mr2.appendChild(z);
	ctopAT(z,0);
    }
    ms.appendChild(mr2);
    n.parentNode.replaceChild(ms,n);
}



ctopTapply["log"] = function(n,f,a,b,q,p)  {
    var mr = ctopE('mrow');
    var mi = ctopE('mi');
    mi.textContent='log';
    if(q.length &&q[0].localName=='logbase'){
	var ms = ctopE('msub');
	ms.appendChild(mi);
	var z=q[0].children[0];
	ms.appendChild(z);
	ctopAT(z,0);
	mr.appendChild(ms);
    } else {
	mr.appendChild(mi);
    }
    var z=a[0];
    mr.appendChild(z);
    ctopAT(z,7);
    n.parentNode.replaceChild(mr,n);
}


ctopTapply["int"] = function(n,f,a,b,q,p)  {
    var mr = ctopE('mrow');
    var mo = ctopE('mo');
    mo.textContent='\u222B';
    var mss=ctopE('msubsup');
    mss.appendChild(mo);
    var mr1 = ctopE('mrow');
    for(var i=0; i<q.length;i++){
	if(q[i].localName=='lowlimit'||
	   q[i].localName=='condition'||
	   q[i].localName=='domainofapplication')
	{
	    while(q[i].children.length){
		var z=q[i].children[0];
		mr1.appendChild(z);
		ctopAT(z);
	    }
	} else if (q[i].localName=='interval' && q[i].children.length==2) {
	    var z=q[i].children[0];
	    mr1.appendChild(z);
	    ctopAT(z);
	}
    }
    mss.appendChild(mr1);
    var mr2 = ctopE('mrow');
    for(var i=0; i<q.length;i++){
	if(q[i].localName=='uplimit' ||q[i].localName=='interval' )
	{
	    while(q[i].children.length){
		var z=q[i].children[0];
		mr2.appendChild(z);
		ctopAT(z,0);
	    }
	}
    }
    mss.appendChild(mr2);
    mr.appendChild(mss);
    for(var i=0; i<a.length;i++){
	var z=a[i];
	mr.appendChild(z);
	ctopAT(z,0);
    }
    for(var i=0; i<b.length;i++){
	var z=b[i];
	if(z.children.length){
	    var mr3=ctopE("mrow");
	    var mi=ctopE("mi");
	    mi.textContent="d";
	    mr3.appendChild(mi)
	    mr3.appendChild(z.children[0]);
	    ctopAT(z,0);
	    mr.appendChild(mr3);
	}
    }
    n.parentNode.replaceChild(mr,n);
}







function ctopO(n,f,a,b,q,p,s)  {
    var mr = ctopE('mrow');
    var mo = ctopE('mo');
    mo.textContent=s;
    var mss=ctopE('munderover');
    mss.appendChild(mo);
    var mr1 = ctopE('mrow');
    for(var i=0; i<q.length;i++){
	if(q[i].localName=='lowlimit'||
	   q[i].localName=='condition'||
	   q[i].localName=='domainofapplication')
	{
	    if(q[i].localName=='lowlimit'){
		for(var j=0; j<b.length;j++){
		    var z=b[j];
		    if(z.children.length){
			mr1.appendChild(z.children[0]);
			ctopAT(z);
		    }
		}
		if(b.length){
		    mo=ctopfa.cloneNode(true);
		    mo.textContent="=";
		    mr1.appendChild(mo);
		}
	    }
	    while(q[i].children.length){
		var z=q[i].children[0];
		mr1.appendChild(z);
		ctopAT(z);
	    }
	} else if (q[i].localName=='interval' && q[i].children.length==2) {
	    for(var j=0; j<b.length;j++){
		var z=b[j];
		if(z.children.length){
		    mr1.appendChild(z.children[0]);
		    ctopAT(z);
		}
	    }
	    if(b.length){
		mo=ctopfa.cloneNode(true);
		mo.textContent="=";
		mr1.appendChild(mo);
	    }
	    var z=q[i].children[0];
	    mr1.appendChild(z);
	    ctopAT(z);
	}
    }
    mss.appendChild(mr1);
    var mr2 = ctopE('mrow');
    for(var i=0; i<q.length;i++){
	if(q[i].localName=='uplimit' ||q[i].localName=='interval' )
	{
	    while(q[i].children.length){
		var z=q[i].children[0];
		mr2.appendChild(z);
		ctopAT(z,0);
	    }
	}
    }
    mss.appendChild(mr2);
    mr.appendChild(mss);
    for(var i=0; i<a.length;i++){
	var z=a[i];
	mr.appendChild(z);
	ctopAT(z,0);
    }
    n.parentNode.replaceChild(mr,n);
}


ctopTapply["sum"] = function (n,f,a,b,q,p){ctopO(n,f,a,b,q,p,'\u2211')};

ctopTapply["product"] = function (n,f,a,b,q,p){ctopO(n,f,a,b,q,p,'\u220F')};


function ctopBd(n,f,a,b,q,p,s)  {
    var mr = ctopE('mrow');
    var mo = ctopE('mo');
    mo.textContent=s;
    mr.appendChild(mo);
    var cnd=0;
    for(var i=0; i<q.length;i++){
	if(q[i].localName=='condition')	{
	    cnd=1;
	    while(q[i].children.length){
		var z=q[i].children[0];
		mr.appendChild(z);
		ctopAT(z);
	    }
	}
    }
    if(cnd==0){
	for(var j=0; j<b.length;j++){
	    var z=b[j];
	    if(z.children.length){
		mr.appendChild(z.children[0]);
		ctopAT(z);
	    }
	}
    }
    if(b.length||c.length){
	mo=ctopfa.cloneNode(true);
	mo.textContent=".";
	mr.appendChild(mo);
    }
    for(var i=0; i<a.length;i++){
	var z=a[i];
	mr.appendChild(z);
	ctopAT(z,0);
    }
    n.parentNode.replaceChild(mr,n);
}

ctopTapply["forall"] = function (n,f,a,b,q,p){ctopBd(n,f,a,b,q,p,'\u2200')};
ctopTapply["exists"] = function (n,f,a,b,q,p){ctopBd(n,f,a,b,q,p,'\u2203')};
ctopTapply["lambda"] = function (n,f,a,b,q,p){ctopBd(n,f,a,b,q,p,'\u03BB')};


ctopTapply["inverse"] = function(n,f,a,b,q,p)  {
    var s = ctopE('msup');
    var z= (a.length)? a[0]:ctopE('mrow');
    s.appendChild(z)
    ctopAT(z,p);
    var mf=ctopE('mfenced');
    var mn=ctopE('mn');
    mn.textContent='-1';
    mf.appendChild(mn);
    s.appendChild(mf);
    n.parentNode.replaceChild(s,n);
}


ctopT["ident"] = function(n,p) {ctopMI(n,"id")}

ctopT["domainofapplication"] = function(n,p) {
    var me=ctopE('merror');
    var mt=ctopE('mtext');
    mt.textContent='unexpected domainofapplication';
    me.appendChild(mt);
    n.parentNode.replaceChild(me,n);
}



ctopTapply["quotient"] = function(n,f,a,b,q,p)  {
    var mr=ctopE('mrow');
    var mo=ctopE(mo);
    mo.textContent='\u230A';
    mr.appendChild(mo)
    var z= a[0].cloneNode(true);
    ctopAT(z,0);
    mo=ctopE(mo);
    mo.textContent='/';
    mr.appendChild(mo)
    var z= a[1].cloneNode(true);
    s.appendChild(z)
    ctopAT(z,0);
    mo=ctopE(mo);
    mo.textContent='\u230B';
    mr.appendChild(mo)
    n.parentNode.replaceChild(mr,n);
}


ctopTapply["factorial"] = function(n,f,a,b,q,p)  {
    var mr=ctopE('mrow');
    var mo=ctopE(mo);
    mo.textContent='!';
    mr.appendChild(mo);
    var z= a[0];
    mr.appendChild(z);
    ctopAT(z,0);
    mr.appendChild(mo)
    n.parentNode.replaceChild(mr,n);
}


ctopTapply["root"] = function(n,f,a,b,q,p)  {
    var mr;
    if(q.length==0 || (q[0].localName=='degree' && q[0].textContent=='2')){
	mr=ctopE('msqrt');
	for(var i=0;i<a.length;i++){
	    mr.appendChild(a[i]);
	    ctopAT(a[i]);
	}
    } else {
	mr=ctopE('mroot');
	mr.appendChild(a[0]);
	ctopAT(a[0]);
	var z=q[0].childNodes[0];
	mr.appendChild(z);
	ctopAT(z);
    }
    n.parentNode.replaceChild(mr,n);
}


